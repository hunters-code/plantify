import type {
  TransferAccount,
  TransferArgs,
  BalanceResponse,
  TransferResponse,
  TokenConfig,
  TokenInfoResponse,
  TopUpRequest,
  TopUpResponse,
  Result_3,
  CollateralInfo,
  CollateralProgressResponse,
  CollateralTopUp,
  Result_21,
  Result_22,
} from '@/declarations/plantify_backend/plantify_backend.did';

import { BaseService } from '../BaseService';

/**
 * Service for token operations
 */
export class TokenService extends BaseService {
  /**
   * Get token balance for an account
   * @param account - The account to check
   * @param tokenType - The type of token (e.g., 'ckUSDC', 'ICP')
   * @returns The balance response
   */
  public static async getBalance(
    account: TransferAccount,
    tokenType: string
  ): Promise<BalanceResponse> {
    try {
      const actor = await this.getActor();
      return await actor.getBalance(account, tokenType);
    } catch (error) {
      console.error('Error getting balance:', error);
      return { Error: 'Failed to get balance' };
    }
  }

  /**
   * Get ckUSDC balance for an account
   * @param account - The account to check
   * @returns The balance response
   */
  public static async getCkUSDCBalance(
    account: TransferAccount
  ): Promise<BalanceResponse> {
    try {
      const actor = await this.getActor();
      return await actor.getCkUSDCBalance(account);
    } catch (error) {
      console.error('Error getting ckUSDC balance:', error);
      return { Error: 'Failed to get ckUSDC balance' };
    }
  }

  /**
   * Get ICP balance for an account
   * @param account - The account to check
   * @returns The balance response
   */
  public static async getICPBalance(
    account: TransferAccount
  ): Promise<BalanceResponse> {
    try {
      const actor = await this.getActor();
      return await actor.getICPBalance(account);
    } catch (error) {
      console.error('Error getting ICP balance:', error);
      return { Error: 'Failed to get ICP balance' };
    }
  }

  /**
   * Transfer tokens
   * @param args - The transfer arguments
   * @returns The transfer response
   */
  public static async transferTokens(
    args: TransferArgs
  ): Promise<TransferResponse> {
    try {
      const actor = await this.getActor();
      return await actor.transferTokens(args);
    } catch (error) {
      console.error('Error transferring tokens:', error);
      return { Error: 'Failed to transfer tokens' };
    }
  }

  /**
   * Transfer ckUSDC
   * @param toAccount - The recipient account
   * @param amount - The amount to transfer
   * @param memo - Optional memo
   * @returns The transfer response
   */
  public static async transferCkUSDC(
    toAccount: TransferAccount,
    amount: bigint,
    memo?: string
  ): Promise<TransferResponse> {
    try {
      const actor = await this.getActor();
      return await actor.transferCkUSDC(toAccount, amount, memo ? [memo] : []);
    } catch (error) {
      console.error('Error transferring ckUSDC:', error);
      return { Error: 'Failed to transfer ckUSDC' };
    }
  }

  /**
   * Transfer ICP
   * @param toAccount - The recipient account
   * @param amount - The amount to transfer
   * @param memo - Optional memo
   * @returns The transfer response
   */
  public static async transferICP(
    toAccount: TransferAccount,
    amount: bigint,
    memo?: string
  ): Promise<TransferResponse> {
    try {
      const actor = await this.getActor();
      return await actor.transferICP(toAccount, amount, memo ? [memo] : []);
    } catch (error) {
      console.error('Error transferring ICP:', error);
      return { Error: 'Failed to transfer ICP' };
    }
  }

  /**
   * Get token information
   * @param tokenType - The type of token
   * @returns The token information
   */
  public static async getTokenInfo(
    tokenType: string
  ): Promise<TokenInfoResponse> {
    try {
      const actor = await this.getActor();
      return await actor.getTokenInfo(tokenType);
    } catch (error) {
      console.error('Error getting token info:', error);
      return { Error: 'Failed to get token info' };
    }
  }

  /**
   * Get ckUSDC token configuration
   * @returns The token configuration
   */
  public static async getCkUSDCTokenConfig(): Promise<TokenConfig | null> {
    try {
      const actor = await this.getActor();
      return await actor.getCkUSDCTokenConfig();
    } catch (error) {
      console.error('Error getting ckUSDC token config:', error);
      return null;
    }
  }

  /**
   * Get ICP token configuration
   * @returns The token configuration
   */
  public static async getICPTokenConfig(): Promise<TokenConfig | null> {
    try {
      const actor = await this.getActor();
      return await actor.getICPTokenConfig();
    } catch (error) {
      console.error('Error getting ICP token config:', error);
      return null;
    }
  }

  /**
   * Top up collateral
   * @param request - The top-up request
   * @returns The top-up response or error message
   */
  public static async topUpCollateral(
    request: TopUpRequest
  ): Promise<{ success: boolean; response?: TopUpResponse; error?: string }> {
    try {
      const actor = await this.getActor();
      const result: Result_3 = await actor.topUpCollateral(request);

      if ('ok' in result) {
        return { success: true, response: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error topping up collateral:', error);
      return { success: false, error: 'Failed to top up collateral' };
    }
  }

  /**
   * Get collateral status for a startup
   * @param startupId - The ID of the startup
   * @returns The collateral info or error message
   */
  public static async getCollateralStatus(
    startupId: string
  ): Promise<{ success: boolean; info?: CollateralInfo; error?: string }> {
    try {
      const actor = await this.getActor();
      const result: Result_22 = await actor.getCollateralStatus(startupId);

      if ('ok' in result) {
        return { success: true, info: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error getting collateral status:', error);
      return { success: false, error: 'Failed to get collateral status' };
    }
  }

  /**
   * Get collateral progress for a startup
   * @param startupId - The ID of the startup
   * @returns The collateral progress
   */
  public static async getCollateralProgress(
    startupId: string
  ): Promise<CollateralProgressResponse> {
    try {
      const actor = await this.getActor();
      return await actor.getCollateralProgress(startupId);
    } catch (error) {
      console.error('Error getting collateral progress:', error);
      return { Error: 'Failed to get collateral progress' };
    }
  }

  /**
   * Get collateral top-up history for a startup
   * @param startupId - The ID of the startup
   * @returns The top-up history or error message
   */
  public static async getCollateralTopUpHistory(startupId: string): Promise<{
    success: boolean;
    history?: CollateralTopUp[];
    error?: string;
  }> {
    try {
      const actor = await this.getActor();
      const result: Result_21 =
        await actor.getCollateralTopUpHistory(startupId);

      if ('ok' in result) {
        return { success: true, history: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error getting collateral top-up history:', error);
      return { success: false, error: 'Failed to get top-up history' };
    }
  }
}
