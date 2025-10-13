import type {
  Startup,
  StartupSummary,
  NFTInfo,
  NFTPurchaseInfo,
  NFTPurchaseHistory,
  NFTPurchaseStats,
  PaginatedStartups,
  Result_9,
  Result_12,
  Result_13,
  TeamMembersResponse,
  TeamMemberOverview,
  FundingStatus,
  FundingStatusResponse,
} from '@/declarations/plantify_backend/plantify_backend.did';

import { BaseService } from '../BaseService';

/**
 * Service for startup marketplace operations
 */
export class StartupService extends BaseService {
  /**
   * Get all startups - can be called anonymously
   * @deprecated Use getStartupsPaginated instead to avoid payload size errors
   * @returns Array of startups
   */
  public static async getAllStartups(): Promise<StartupSummary[]> {
    try {
      // Use the paginated method with a large limit instead
      const result = await this.getStartupsPaginated({
        page: 1,
        limit: 100,
      });
      return result.startups;
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
    startups: StartupSummary[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const actor = await this.getActor();
      // Backend uses 0-based pagination, but frontend uses 1-based pagination
      const result = await actor.getStartupsPaginated({
        page: BigInt(params.page - 1), // Convert from 1-based to 0-based
        limit: BigInt(params.limit),
      });

      // Convert BigInt values back to number for frontend use
      return {
        startups: result.startups,
        totalCount: Number(result.totalCount),
        page: Number(result.page) + 1, // Convert from 0-based to 1-based
        limit: Number(result.limit),
        totalPages: Number(result.totalPages),
      };
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
      const actor = await this.getActor();
      const count = await actor.getStartupsCount();
      return Number(count);
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
  public static async getFeaturedStartup(): Promise<StartupSummary | null> {
    try {
      const actor = await this.getActor();
      const result = await actor.getStartupsPaginated({
        page: BigInt(0), // Backend uses 0-based pagination
        limit: BigInt(1),
      });
      return result.startups.length > 0 ? result.startups[0] : null;
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
      const result: Result_13 = await actor.getNFTPrice(startupId);

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
      const result: Result_12 = await actor.getNFTsByStartup(startupId);

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
      const result: Result_9 = await actor.getStartupPurchaseHistory(startupId);

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

  /**
   * Get team members for a specific startup
   * @param startupId - The ID of the startup
   * @returns Array of team members or error message
   */
  public static async getStartupTeamMembers(
    startupId: string
  ): Promise<{
    success: boolean;
    members?: TeamMemberOverview[];
    error?: string;
  }> {
    try {
      const actor = await this.getActor();
      const result = await actor.getStartupTeamMembers(startupId);

      if ('Success' in result) {
        return { success: true, members: result.Success };
      } else if ('Error' in result) {
        return { success: false, error: result.Error };
      }

      // Default fallback
      return { success: false, error: 'Unknown response format' };
    } catch (error) {
      console.error('Error getting startup team members:', error);
      return { success: false, error: 'Failed to fetch team members' };
    }
  }

  /**
   * Get funding status for a specific startup
   * @param startupId - The ID of the startup
   * @returns Funding status data or error message
   */
  public static async getFundingStatus(
    startupId: string
  ): Promise<{ success: boolean; data?: FundingStatus; error?: string }> {
    try {
      const actor = await this.getActor();
      const result = await actor.getFundingStatus(startupId);

      if ('Success' in result) {
        return { success: true, data: result.Success };
      } else if ('Error' in result) {
        return { success: false, error: result.Error };
      }

      // Default fallback
      return { success: false, error: 'Unknown response format' };
    } catch (error) {
      console.error('Error getting funding status:', error);
      return { success: false, error: 'Failed to fetch funding status' };
    }
  }
}
