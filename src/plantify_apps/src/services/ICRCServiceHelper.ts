import { icrcService } from './ICRCService';
import { Principal } from '@dfinity/principal';

/**
 * Helper functions for ICRCService integration with auth context
 */
export class ICRCServiceHelper {
  /**
   * Initialize ICRC service with user identity
   * Call this after user authentication
   */
  static async initializeWithAuth(identity: any) {
    try {
      await icrcService.initialize(identity);
      console.log('ICRC Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ICRC service:', error);
      throw new Error('Failed to initialize ICRC service');
    }
  }

  /**
   * Get user balance with proper error handling
   */
  static async getUserBalance(userPrincipal: Principal): Promise<bigint> {
    try {
      return await icrcService.getBalance(userPrincipal);
    } catch (error) {
      console.error('Failed to get user balance:', error);
      throw new Error('Failed to get user balance');
    }
  }

  /**
   * Get user balance in dollars (converted from smallest units)
   */
  static async getUserBalanceInDollars(
    userPrincipal: Principal
  ): Promise<number> {
    try {
      const balance = await icrcService.getBalance(userPrincipal);
      return Number(balance) / 100; // Convert from cents to dollars
    } catch (error) {
      console.error('Failed to get user balance in dollars:', error);
      throw new Error('Failed to get user balance in dollars');
    }
  }

  /**
   * Complete NFT purchase with proper error handling
   */
  static async purchaseNFT(
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
      return await icrcService.completeNFTPurchase(toAccount, amount, memo);
    } catch (error) {
      console.error('Failed to complete NFT purchase:', error);
      return {
        success: false,
        error: `Failed to complete NFT purchase: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get transfer fee
   */
  static async getTransferFee(): Promise<bigint> {
    try {
      return await icrcService.getFee();
    } catch (error) {
      console.error('Failed to get transfer fee:', error);
      return BigInt(100000); // Default fee
    }
  }

  /**
   * Get token metadata
   */
  static async getTokenMetadata() {
    try {
      return await icrcService.getMetadata();
    } catch (error) {
      console.error('Failed to get token metadata:', error);
      throw new Error('Failed to get token metadata');
    }
  }
}
