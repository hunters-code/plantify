import { HttpAgent, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { IcrcLedgerCanister } from '@dfinity/ledger-icrc';

export interface TransferParams {
  to: Principal;
  amount: bigint;
  fee?: bigint;
  memo?: Uint8Array;
  from_subaccount?: Uint8Array;
  created_at_time?: bigint;
}

export interface TransferResult {
  Ok?: {
    blockIndex: bigint;
  };
  Err?: string;
}

export class ICRCService {
  private ledger: IcrcLedgerCanister | null = null;
  private agent: HttpAgent | null = null;

  async initialize(identity: Identity) {
    // Get the ckUSDC canister ID from environment or configuration
    const ckUSDC_CANISTER_ID = 'hbxhn-uiaaa-aaaak-qumlq-cai';

    this.agent = new HttpAgent({
      host: 'https://ic0.app',
      identity: identity,
    });

    // For mainnet, we don't need to fetch the root key
    if (process.env.NODE_ENV !== 'production') {
      await this.agent.fetchRootKey();
    }

    this.ledger = IcrcLedgerCanister.create({
      agent: this.agent,
      canisterId: Principal.fromText(ckUSDC_CANISTER_ID),
    });
  }

  async getBalance(account: Principal): Promise<bigint> {
    if (!this.ledger) throw new Error('ICRC service not initialized');

    try {
      const balance = await this.ledger.balance({
        owner: account,
        subaccount: [],
        certified: true,
      });
      return balance;
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw new Error('Failed to get account balance');
    }
  }

  async transfer(params: TransferParams): Promise<TransferResult> {
    if (!this.ledger) throw new Error('ICRC service not initialized');

    try {
      const result = await this.ledger.transfer({
        to: {
          owner: params.to,
          subaccount: [],
        },
        amount: params.amount,
        fee: params.fee,
        memo: params.memo,
        from_subaccount: params.from_subaccount,
        created_at_time: params.created_at_time,
      });

      if (typeof result === 'bigint') {
        return {
          Ok: {
            blockIndex: result,
          },
        };
      } else {
        return {
          Err: 'Transfer failed',
        };
      }
    } catch (error) {
      console.error('Transfer failed:', error);
      return {
        Err: `Transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  async getFee(): Promise<bigint> {
    // Default fee for ckUSDC transfers (usually 0.0001 ckUSDC)
    return BigInt(100000); // 0.0001 ckUSDC in smallest units
  }

  async getMetadata() {
    if (!this.ledger) throw new Error('ICRC service not initialized');

    try {
      const metadata = await this.ledger.metadata({});
      return metadata;
    } catch (error) {
      console.error('Failed to get metadata:', error);
      throw new Error('Failed to get ledger metadata');
    }
  }

  /**
   * Create a memo from text
   */
  createMemo(text: string): Uint8Array {
    return new TextEncoder().encode(text);
  }

  /**
   * Complete NFT purchase with ICRC transfer
   */
  async completeNFTPurchase(
    toAccount: Principal,
    amount: bigint,
    memo: string
  ): Promise<{
    success: boolean;
    blockIndex?: bigint;
    transactionId?: string;
    error?: string;
  }> {
    try {
      const fee = await this.getFee();
      const transferResult = await this.transfer({
        to: toAccount,
        amount,
        fee,
        memo: this.createMemo(memo),
        created_at_time: BigInt(Date.now() * 1_000_000), // Convert to nanoseconds
      });

      if (transferResult.Ok) {
        return {
          success: true,
          blockIndex: transferResult.Ok.blockIndex,
          transactionId: transferResult.Ok.blockIndex.toString(),
        };
      } else {
        return {
          success: false,
          error: transferResult.Err || 'Transfer failed',
        };
      }
    } catch (error) {
      console.error('Error completing NFT purchase:', error);
      return {
        success: false,
        error: `Failed to complete NFT purchase: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}

export const icrcService = new ICRCService();
