import type {
  Investor,
  InvestorRegistrationRequest,
  InvestorProfileUpdateRequest,
  Result_4,
  NFTPurchaseRequest,
  NFTPurchaseResponse,
  NFTPurchaseHistory,
  Result_6,
  Result_10,
} from '@/declarations/plantify_backend/plantify_backend.did';

import { BaseService } from '../BaseService';

/**
 * Service for investor-related operations
 */
export class InvestorService extends BaseService {
  /**
   * Register a new investor
   * @param request - The investor registration request
   * @returns The registered investor or error message
   */
  public static async registerInvestor(
    request: InvestorRegistrationRequest
  ): Promise<{ success: boolean; investor?: Investor; error?: string }> {
    try {
      const actor = await this.getActor();
      const result: Result_4 = await actor.registerInvestor(request);

      if ('ok' in result) {
        return { success: true, investor: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error registering investor:', error);
      return { success: false, error: 'Failed to register investor' };
    }
  }

  /**
   * Get the current investor's information
   * @returns The investor information or null if not found
   */
  public static async getInvestorByPrincipal(): Promise<Investor | null> {
    try {
      const actor = await this.getActor();
      const investorOpt = await actor.getInvestorByPrincipal();
      return investorOpt.length ? investorOpt[0] : null;
    } catch (error) {
      console.error('Error getting investor by principal:', error);
      return null;
    }
  }

  /**
   * Purchase an NFT for a startup
   * @param request - The NFT purchase request
   * @returns The purchase response or error message
   */
  public static async purchaseNFT(request: NFTPurchaseRequest): Promise<{
    success: boolean;
    response?: NFTPurchaseResponse;
    error?: string;
  }> {
    try {
      const actor = await this.getActor();
      const result: Result_6 = await actor.purchaseNFT(request);

      if ('ok' in result) {
        return { success: true, response: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      return { success: false, error: 'Failed to purchase NFT' };
    }
  }

  /**
   * Check if an investor can purchase an NFT for a specific startup
   * @param investorId - The ID of the investor
   * @param startupId - The ID of the startup
   * @returns True if the investor can purchase, false otherwise
   */
  public static async canPurchaseNFT(
    investorId: string,
    startupId: string
  ): Promise<boolean> {
    try {
      const actor = await this.getActor();
      const result = await actor.canPurchaseNFT(investorId, startupId);
      return 'ok' in result ? result.ok : false;
    } catch (error) {
      console.error('Error checking if investor can purchase NFT:', error);
      return false;
    }
  }

  /**
   * Get the purchase history for an investor
   * @param investorId - The ID of the investor
   * @returns The purchase history or error message
   */
  public static async getInvestorPurchaseHistory(investorId: string): Promise<{
    success: boolean;
    history?: NFTPurchaseHistory;
    error?: string;
  }> {
    try {
      const actor = await this.getActor();
      const result: Result_10 =
        await actor.getInvestorPurchaseHistory(investorId);

      if ('ok' in result) {
        return { success: true, history: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error getting investor purchase history:', error);
      return { success: false, error: 'Failed to get purchase history' };
    }
  }

  /**
   * Get all investors
   * @returns Array of investors
   */
  public static async getAllInvestors(): Promise<Investor[]> {
    try {
      const actor = await this.getActor();
      return await actor.getInvestors();
    } catch (error) {
      console.error('Error getting all investors:', error);
      return [];
    }
  }

  /**
   * Get the current investor's profile
   * @returns The investor profile or null if not found
   */
  public static async getInvestorProfile(): Promise<Investor | null> {
    try {
      const actor = await this.getActor();
      const investorOpt = await actor.getInvestorProfile();
      return investorOpt.length ? investorOpt[0] : null;
    } catch (error) {
      console.error('Error getting investor profile:', error);
      return null;
    }
  }

  /**
   * Update the current investor's profile
   * @param request - The profile update request
   * @returns The updated investor or error message
   */
  public static async updateInvestorProfile(
    request: InvestorProfileUpdateRequest
  ): Promise<{ success: boolean; investor?: Investor; error?: string }> {
    try {
      const actor = await this.getActor();
      const result: Result_4 = await actor.updateInvestorProfile(request);

      if ('ok' in result) {
        return { success: true, investor: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error updating investor profile:', error);
      return { success: false, error: 'Failed to update investor profile' };
    }
  }
}
