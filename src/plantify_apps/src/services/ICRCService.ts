import { IcrcLedgerCanister } from '@dfinity/ledger-icrc';
import { Principal } from '@dfinity/principal';

import { BaseService } from './BaseService';

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

export interface TokenConfig {
  canisterId: string;
  name: string;
  decimals: number;
  symbol: string;
}

export class ICRCService {
  private ledgers: Map<string, IcrcLedgerCanister> = new Map();
  private tokenConfigs: Map<string, TokenConfig> = new Map();

  private initializeTokenConfigs() {
    // ICP token configuration
    this.tokenConfigs.set('ICP', {
      canisterId: '72oxd-oyaaa-aaaam-qd5na-cai', // ICP Ledger canister ID
      name: 'Internet Computer',
      decimals: 8,
      symbol: 'ICP',
    });

    // ckUSDC token configuration
    this.tokenConfigs.set('ckUSDC', {
      canisterId: 'hbxhn-uiaaa-aaaak-qumlq-cai',
      name: 'USDC',
      decimals: 8,
      symbol: 'ckUSDC',
    });
  }

  private getLedger(tokenSymbol: string): IcrcLedgerCanister {
    if (!BaseService.isInitialized())
      throw new Error('ICRC service not initialized');

    const existingLedger = this.ledgers.get(tokenSymbol);
    if (existingLedger) {
      return existingLedger;
    }

    // Initialize token configurations if not already done
    if (this.tokenConfigs.size === 0) {
      this.initializeTokenConfigs();
    }

    const tokenConfig = this.tokenConfigs.get(tokenSymbol);
    if (!tokenConfig) {
      throw new Error(`Token configuration not found for ${tokenSymbol}`);
    }

    // Get agent from BaseService
    const agent = BaseService.getAgent();
    const ledger = IcrcLedgerCanister.create({
      agent,
      canisterId: Principal.fromText(tokenConfig.canisterId),
    });

    this.ledgers.set(tokenSymbol, ledger);
    return ledger;
  }

  async getBalance(
    account: Principal,
    tokenSymbol: string = 'ckUSDC'
  ): Promise<bigint> {
    try {
      const ledger = this.getLedger(tokenSymbol);
      const balance = await ledger.balance({
        owner: account,
        certified: false,
      });

      return balance;
    } catch (error) {
      console.error(`Failed to get ${tokenSymbol} balance:`, error);
      throw new Error(`Failed to get ${tokenSymbol} account balance`);
    }
  }

  async transfer(
    params: TransferParams,
    tokenSymbol: string = 'ckUSDC'
  ): Promise<TransferResult> {
    try {
      const ledger = this.getLedger(tokenSymbol);
      const result = await ledger.transfer({
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
      console.error(`Transfer failed for ${tokenSymbol}:`, error);
      return {
        Err: `Transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  async getFee(tokenSymbol: string = 'ckUSDC'): Promise<bigint> {
    try {
      const ledger = this.getLedger(tokenSymbol);
      // Get fee from metadata instead of direct fee call
      const metadata = await ledger.metadata({});
      const feeEntry = metadata.find(([key]) => key === 'fee');
      if (feeEntry && feeEntry[1]) {
        const feeValue = feeEntry[1];
        if (typeof feeValue === 'object' && 'Int' in feeValue) {
          return feeValue.Int;
        }
        return BigInt(feeValue.toString());
      }
      throw new Error('Fee not found in metadata');
    } catch (error) {
      console.error(`Failed to get fee for ${tokenSymbol}:`, error);
      // Return default fee based on token
      const tokenConfig = this.tokenConfigs.get(tokenSymbol);
      if (tokenConfig) {
        return BigInt(10 ** (tokenConfig.decimals - 4)); // 0.0001 of the token
      }
      return BigInt(100000); // Default fallback
    }
  }

  async getMetadata(tokenSymbol: string = 'ckUSDC') {
    try {
      const ledger = this.getLedger(tokenSymbol);
      const metadata = await ledger.totalTokensSupply({ certified: true });
      return metadata;
    } catch (error) {
      console.error(`Failed to get metadata for ${tokenSymbol}:`, error);
      throw new Error(`Failed to get ${tokenSymbol} ledger metadata`);
    }
  }

  /**
   * Create a memo from text
   */
  createMemo(text: string): Uint8Array {
    return new TextEncoder().encode(text);
  }

  /**
   * Approve a transfer
   */
  async approve(
    spender: Principal,
    amount: bigint,
    tokenSymbol: string = 'ckUSDC'
  ): Promise<{
    success: boolean;
    blockIndex?: bigint;
    error?: string;
  }> {
    try {
      const ledger = this.getLedger(tokenSymbol);
      const result = await ledger.approve({
        spender: {
          owner: spender,
          subaccount: [],
        },
        amount,
        fee: BigInt(0),
        created_at_time: BigInt(Date.now() * 1_000_000),
      });

      if (typeof result === 'bigint') {
        return {
          success: true,
          blockIndex: result,
        };
      } else {
        return {
          success: false,
          error: 'Approval failed',
        };
      }
    } catch (error) {
      console.error(`Approval failed for ${tokenSymbol}:`, error);
      return {
        success: false,
        error: `Approval failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Transfer from one account to another using ICRC-2 transfer_from
   */
  async transferFrom(
    from: Principal,
    to: Principal,
    amount: bigint,
    tokenSymbol: string = 'ckUSDC'
  ): Promise<{
    success: boolean;
    blockIndex?: bigint;
    transactionId?: string;
    error?: string;
  }> {
    try {
      const ledger = this.getLedger(tokenSymbol);
      const allowance = await ledger.allowance({
        account: {
          owner: from,
          subaccount: [],
        },
        spender: {
          owner: to,
          subaccount: [],
        },
      });
      if (allowance.allowance <= amount && allowance.expires_at) {
        await ledger.approve({
          amount: BigInt(Number(amount) * 100),
          spender: {
            owner: to,
            subaccount: [],
          },
        });
      }

      const result = await ledger.transfer({
        to: {
          owner: to,
          subaccount: [],
        },
        amount,
      });

      if (typeof result === 'bigint') {
        return {
          success: true,
          blockIndex: result,
          transactionId: result.toString(),
        };
      } else {
        return {
          success: false,
          error: 'Transfer from failed',
        };
      }
    } catch (error) {
      console.error(`Transfer from failed for ${tokenSymbol}:`, error);
      return {
        success: false,
        error: `Transfer from failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Complete NFT purchase with ICRC-2 transfer_from
   */
  async completeNFTPurchase(
    fromAccount: Principal,
    toAccount: Principal,
    amount: bigint,
    memo: string,
    tokenSymbol: string = 'ckUSDC'
  ): Promise<{
    success: boolean;
    blockIndex?: bigint;
    transactionId?: string;
    error?: string;
  }> {
    try {
      const transferResult = await this.transferFrom(
        fromAccount,
        toAccount,
        amount,
        tokenSymbol
      );

      return transferResult;
    } catch (error) {
      console.error(
        `Error completing NFT purchase with ${tokenSymbol}:`,
        error
      );
      return {
        success: false,
        error: `Failed to complete NFT purchase: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get token configuration
   */
  getTokenConfig(tokenSymbol: string): TokenConfig | undefined {
    return this.tokenConfigs.get(tokenSymbol);
  }

  /**
   * Get balance in human-readable format
   */
  async getBalanceInUnits(
    account: Principal,
    tokenSymbol: string = 'ckUSDC'
  ): Promise<number> {
    try {
      const balance = await this.getBalance(account, tokenSymbol);
      const tokenConfig = this.tokenConfigs.get(tokenSymbol);
      if (!tokenConfig) {
        throw new Error(`Token configuration not found for ${tokenSymbol}`);
      }
      return Number(balance) / 10 ** tokenConfig.decimals;
    } catch (error) {
      console.error(
        `Failed to get balance in units for ${tokenSymbol}:`,
        error
      );
      throw error;
    }
  }
}

export const icrcService = new ICRCService();
