import type {
  BalanceResponse,
  TransferAccount,
} from '@/declarations/plantify_backend/plantify_backend.did';

import { BaseService } from './BaseService';
import { ICRCServiceHelper } from './ICRCServiceHelper';
import { Principal } from '@dfinity/principal';

/**
 * Service for balance-related operations
 */
export class BalanceService extends BaseService {
  /**
   * Get ICP balance for an account
   * @param account - The account to check balance for
   * @returns The ICP balance or error message
   */
  public static async getICPBalance(account: TransferAccount): Promise<{
    success: boolean;
    balance?: number;
    error?: string;
  }> {
    try {
      const actor = await this.getActor();
      const result: BalanceResponse = await actor.getICPBalance(account);

      if ('Success' in result) {
        // Convert from smallest unit (e8s) to ICP (divide by 100,000,000)
        const rawBalance = Number(result.Success.balance);
        const balance = rawBalance / 100000000;
        return { success: true, balance };
      } else {
        console.error('ICP balance error:', result.Error);
        return { success: false, error: result.Error };
      }
    } catch (error) {
      console.error('Error getting ICP balance:', error);
      return { success: false, error: 'Failed to get ICP balance' };
    }
  }

  /**
   * Get ckUSDC balance for an account using ICRC service
   * @param account - The account to check balance for
   * @returns The ckUSDC balance or error message
   */
  public static async getCkUSDCBalance(account: TransferAccount): Promise<{
    success: boolean;
    balance?: number;
    error?: string;
  }> {
    try {
      // Use ICRC service for ckUSDC balance
      const balance = await ICRCServiceHelper.getUserBalance(account.owner);

      // Convert from smallest unit (cents) to dollars (divide by 100)
      const balanceInDollars = Number(balance) / 100;
      return { success: true, balance: balanceInDollars };
    } catch (error) {
      console.error('Error getting ckUSDC balance via ICRC service:', error);

      // Fallback to backend service if ICRC service fails
      try {
        const actor = await this.getActor();
        const result: BalanceResponse = await actor.getCkUSDCBalance(account);

        if ('Success' in result) {
          // Convert from smallest unit (cents) to dollars (divide by 100)
          const rawBalance = Number(result.Success.balance);
          const balance = rawBalance / 100;
          return { success: true, balance };
        } else {
          console.error('ckUSDC balance error:', result.Error);
          return { success: false, error: result.Error };
        }
      } catch (fallbackError) {
        console.error(
          'Error getting ckUSDC balance from backend:',
          fallbackError
        );
        return { success: false, error: 'Failed to get ckUSDC balance' };
      }
    }
  }

  /**
   * Get balance for any token type
   * @param account - The account to check balance for
   * @param tokenType - The type of token (ICP, ckUSDC, etc.)
   * @returns The token balance or error message
   */
  public static async getBalance(
    account: TransferAccount,
    tokenType: string
  ): Promise<{
    success: boolean;
    balance?: number;
    tokenType?: string;
    error?: string;
  }> {
    try {
      // Use ICRC service for ckUSDC
      if (tokenType.toLowerCase().includes('usdc')) {
        const balance = await ICRCServiceHelper.getUserBalance(account.owner);
        const balanceInDollars = Number(balance) / 100;
        return {
          success: true,
          balance: balanceInDollars,
          tokenType: 'ckUSDC',
        };
      }

      // Use backend service for other tokens (ICP, etc.)
      const actor = await this.getActor();
      const result: BalanceResponse = await actor.getBalance(
        account,
        tokenType
      );

      if ('Success' in result) {
        let balance = Number(result.Success.balance);

        // Apply appropriate conversion based on token type
        if (tokenType.toLowerCase() === 'icp') {
          balance = balance / 100000000; // e8s to ICP
        }
        // Add more token types as needed

        return {
          success: true,
          balance,
          tokenType: result.Success.tokenType,
        };
      } else {
        return { success: false, error: result.Error };
      }
    } catch (error) {
      console.error('Error getting balance:', error);
      return { success: false, error: 'Failed to get balance' };
    }
  }

  /**
   * Get both ICP and ckUSDC balances in parallel
   * @param account - The account to check balances for
   * @returns Both balances or error messages
   */
  public static async getAllBalances(account: TransferAccount): Promise<{
    icp: { success: boolean; balance?: number; error?: string };
    ckUSDC: { success: boolean; balance?: number; error?: string };
  }> {
    try {
      // Ensure the service is initialized with authentication
      if (!this.isInitialized()) {
        // Import AuthClient to get the authenticated client
        const { AuthClient } = await import('@dfinity/auth-client');
        const authClient = await AuthClient.create();
        const isAuth = await authClient.isAuthenticated();

        if (isAuth) {
          await this.initialize(authClient);
          // Also initialize ICRC service with the same identity
          try {
            const identity = await authClient.getIdentity();
            await ICRCServiceHelper.initializeWithAuth(identity);
          } catch (icrcError) {
            console.warn(
              'Failed to initialize ICRC service, will use fallback:',
              icrcError
            );
          }
        } else {
          await this.initialize();
        }
      }

      const [icpResult, ckUSDCResult] = await Promise.all([
        this.getICPBalance(account),
        this.getCkUSDCBalance(account),
      ]);

      return {
        icp: icpResult,
        ckUSDC: ckUSDCResult,
      };
    } catch (error) {
      console.error('Error getting all balances:', error);
      const errorResult = { success: false, error: 'Failed to get balances' };
      return {
        icp: errorResult,
        ckUSDC: errorResult,
      };
    }
  }
}
