import type {
  Startup,
  NFTInfo,
  NFTPurchaseInfo,
  NFTPurchaseHistory,
  NFTPurchaseStats,
  Result_10,
  Result_13,
  Result_14,
} from '@/declarations/plantify_backend/plantify_backend.did';

import { BaseService } from '../BaseService';

/**
 * Service for startup marketplace operations
 */
export class StartupService extends BaseService {
  /**
   * Get all startups - can be called anonymously
   * @returns Array of startups
   */
  public static async getAllStartups(): Promise<Startup[]> {
    try {
      // Initialize with anonymous actor if not already initialized
      if (!this.isInitialized()) {
        await this.initialize();
      }

      const actor = await this.getActor();
      return await actor.getAllStartups();
    } catch (error) {
      console.error('Error getting all startups:', error);
      return [];
    }
  }

  /**
   * Get startups with pagination - can be called anonymously
   * @param params - Pagination parameters
   * @returns Paginated startups data
   */
  public static async getStartupsPaginated(params: {
    page: number;
    limit: number;
  }): Promise<{
    startups: Startup[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      // Initialize with anonymous actor if not already initialized
      if (!this.isInitialized()) {
        await this.initialize();
      }

      const actor = await this.getActor();
      return await actor.getStartupsPaginated(params);
    } catch (error) {
      console.error('Error getting paginated startups:', error);
      return {
        startups: [],
        totalCount: 0,
        page: params.page,
        limit: params.limit,
        totalPages: 0,
      };
    }
  }

  /**
   * Get total count of startups - can be called anonymously
   * @returns Total number of startups
   */
  public static async getStartupsCount(): Promise<number> {
    try {
      // Initialize with anonymous actor if not already initialized
      if (!this.isInitialized()) {
        await this.initialize();
      }

      const actor = await this.getActor();
      return await actor.getStartupsCount();
    } catch (error) {
      console.error('Error getting startups count:', error);
      return 0;
    }
  }

  /**
   * Get details for a specific startup
   * @param startupId - The ID of the startup
   * @returns The startup details or null if not found
   */
  public static async getStartupDetails(
    startupId: string
  ): Promise<Startup | null> {
    try {
      // Initialize with anonymous actor if not already initialized
      if (!this.isInitialized()) {
        console.log('Initializing service for getStartupDetails');
        await this.initialize();
      }

      const actor = await this.getActor();
      const startupOpt = await actor.getStartupDetails(startupId);
      return startupOpt.length ? startupOpt[0] : null;
    } catch (error) {
      console.error('Error getting startup details:', error);
      return null;
    }
  }

  /**
   * Get the featured startup (newest startup)
   * @returns The featured startup or null if not found
   */
  public static async getFeaturedStartup(): Promise<Startup | null> {
    try {
      // Initialize with anonymous actor if not already initialized
      if (!this.isInitialized()) {
        console.log('Initializing service for getFeaturedStartup');
        await this.initialize();
      }

      const actor = await this.getActor();
      const allStartups = await actor.getAllStartups();
      return allStartups.length > 0 ? allStartups[0] : null;
    } catch (error) {
      console.error('Error getting featured startup:', error);
      return null;
    }
  }

  /**
   * Get the NFT price for a startup
   * @param startupId - The ID of the startup
   * @returns The NFT price or error message
   */
  public static async getNFTPrice(
    startupId: string
  ): Promise<{ success: boolean; price?: bigint; error?: string }> {
    try {
      const actor = await this.getActor();
      const result: Result_14 = await actor.getNFTPrice(startupId);

      if ('ok' in result) {
        return { success: true, price: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error getting NFT price:', error);
      return { success: false, error: 'Failed to get NFT price' };
    }
  }

  /**
   * Get all NFTs for a specific startup
   * @param startupId - The ID of the startup
   * @returns Array of NFTs or error message
   */
  public static async getNFTsByStartup(
    startupId: string
  ): Promise<{ success: boolean; nfts?: NFTInfo[]; error?: string }> {
    try {
      const actor = await this.getActor();
      const result: Result_13 = await actor.getNFTsByStartup(startupId);

      if ('ok' in result) {
        return { success: true, nfts: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error getting NFTs by startup:', error);
      return { success: false, error: 'Failed to get NFTs' };
    }
  }

  /**
   * Get purchase history for a startup
   * @param startupId - The ID of the startup
   * @returns The purchase history or error message
   */
  public static async getStartupPurchaseHistory(startupId: string): Promise<{
    success: boolean;
    history?: NFTPurchaseHistory;
    error?: string;
  }> {
    try {
      const actor = await this.getActor();
      const result: Result_10 =
        await actor.getStartupPurchaseHistory(startupId);

      if ('ok' in result) {
        return { success: true, history: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error getting startup purchase history:', error);
      return { success: false, error: 'Failed to get purchase history' };
    }
  }

  /**
   * Get all NFT purchases across all startups
   * @returns Array of NFT purchases
   */
  public static async getAllPurchases(): Promise<NFTPurchaseInfo[]> {
    try {
      const actor = await this.getActor();
      return await actor.getAllPurchases();
    } catch (error) {
      console.error('Error getting all purchases:', error);
      return [];
    }
  }

  /**
   * Get NFT purchase statistics
   * @returns NFT purchase statistics
   */
  public static async getPurchaseStats(): Promise<NFTPurchaseStats | null> {
    try {
      const actor = await this.getActor();
      return await actor.getPurchaseStats();
    } catch (error) {
      console.error('Error getting purchase stats:', error);
      return null;
    }
  }
}
