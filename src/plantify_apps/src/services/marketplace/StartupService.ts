import { HttpAgent } from '@dfinity/agent';

import { createActor } from '@/declarations/plantify_backend';
import type {
  Startup,
  NFTInfo,
  NFTPurchaseInfo,
  NFTPurchaseHistory,
  NFTPurchaseStats,
  Result_10,
  Result_13,
  Result_14,
  _SERVICE,
} from '@/declarations/plantify_backend/plantify_backend.did';

import { BaseService } from '../BaseService';

/**
 * Service for startup marketplace operations
 */
export class StartupService extends BaseService {
  // Hardcoded canister ID as fallback
  private static readonly HARDCODED_CANISTER_ID = 'a5ptu-ryaaa-aaaai-q32cq-cai';
  /**
   * Get all startups - can be called anonymously
   * @returns Array of startups
   */
  public static async getAllStartups(): Promise<Startup[]> {
    try {
      // Create anonymous actor if not initialized
      if (!this.isInitialized()) {
        const anonymousAgent = new HttpAgent({ host: 'https://ic0.app' });

        // Skip fetchRootKey to avoid HTTP errors
        console.log('Skipping fetchRootKey in development environment');

        // Use canisterId from BaseService or hardcoded fallback
        const effectiveCanisterId =
          this.canisterId || this.HARDCODED_CANISTER_ID;
        console.log(
          'Using canister ID for anonymous actor:',
          effectiveCanisterId
        );

        const anonymousActor = createActor(effectiveCanisterId, {
          agent: anonymousAgent,
        }) as _SERVICE;

        return await anonymousActor.getAllStartups();
      }

      // Use existing actor if already initialized
      return await this.getActor().getAllStartups();
    } catch (error) {
      console.error('Error getting all startups:', error);
      return [];
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
      // Create anonymous actor if not initialized
      if (!this.isInitialized()) {
        console.log('Creating anonymous actor for getStartupDetails');
        const anonymousAgent = new HttpAgent({ host: 'https://ic0.app' });

        // Skip fetchRootKey to avoid HTTP errors
        console.log('Skipping fetchRootKey in development environment');

        // Use canisterId from BaseService or hardcoded fallback
        const effectiveCanisterId =
          this.canisterId || this.HARDCODED_CANISTER_ID;
        console.log(
          'Using canister ID for getStartupDetails:',
          effectiveCanisterId
        );

        const anonymousActor = createActor(effectiveCanisterId, {
          agent: anonymousAgent,
        }) as _SERVICE;

        const startupOpt = await anonymousActor.getStartupDetails(startupId);
        return startupOpt.length ? startupOpt[0] : null;
      }

      // Use existing actor if already initialized
      const startupOpt = await this.getActor().getStartupDetails(startupId);
      return startupOpt.length ? startupOpt[0] : null;
    } catch (error) {
      console.error('Error getting startup details:', error);
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
      let result: Result_14;
      // Create anonymous actor if not initialized
      if (!this.isInitialized()) {
        console.log('Creating anonymous actor for getNFTPrice');
        const anonymousAgent = new HttpAgent({ host: 'https://ic0.app' });

        // Skip fetchRootKey to avoid HTTP errors
        console.log('Skipping fetchRootKey in development environment');

        // Use canisterId from BaseService or hardcoded fallback
        const effectiveCanisterId =
          this.canisterId || this.HARDCODED_CANISTER_ID;
        console.log('Using canister ID for getNFTPrice:', effectiveCanisterId);
        const anonymousActor = createActor(effectiveCanisterId, {
          agent: anonymousAgent,
        }) as _SERVICE;

        result = await anonymousActor.getNFTPrice(startupId);
      } else {
        // Use existing actor if already initialized
        result = await this.getActor().getNFTPrice(startupId);
      }

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
      let result: Result_13;
      // Create anonymous actor if not initialized
      if (!this.isInitialized()) {
        console.log('Creating anonymous actor for getNFTsByStartup');
        const anonymousAgent = new HttpAgent({ host: 'https://ic0.app' });

        // Skip fetchRootKey to avoid HTTP errors
        console.log('Skipping fetchRootKey in development environment');

        // Use canisterId from BaseService or hardcoded fallback
        const effectiveCanisterId =
          this.canisterId || this.HARDCODED_CANISTER_ID;
        console.log(
          'Using canister ID for getNFTsByStartup:',
          effectiveCanisterId
        );
        const anonymousActor = createActor(effectiveCanisterId, {
          agent: anonymousAgent,
        }) as _SERVICE;

        result = await anonymousActor.getNFTsByStartup(startupId);
      } else {
        // Use existing actor if already initialized
        result = await this.getActor().getNFTsByStartup(startupId);
      }

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
      const result: Result_10 =
        await this.getActor().getStartupPurchaseHistory(startupId);

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
      return await this.getActor().getAllPurchases();
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
      return await this.getActor().getPurchaseStats();
    } catch (error) {
      console.error('Error getting purchase stats:', error);
      return null;
    }
  }
}
