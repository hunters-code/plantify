import type {
  NFTInfo,
  NFTAccount,
  NFTBalanceResponse,
  NFTOwnerResponse,
  MintNFTRequest,
  MintNFTResponse,
  TransferNFTRequest,
  TransferNFTResponse,
  NFTConfig,
  Result_2,
  Result_8,
  Result_15,
  Result_16,
  Result_17,
  Result_24,
} from '@/declarations/plantify_backend/plantify_backend.did';

import { BaseService } from '../BaseService';

/**
 * Service for NFT operations
 */
export class NFTService extends BaseService {
  /**
   * Get all NFTs
   * @returns Array of NFTs
   */
  public static async getAllNFTs(): Promise<NFTInfo[]> {
    try {
      const actor = await this.getActor();
      return await actor.getAllNFTs();
    } catch (error) {
      console.error('Error getting all NFTs:', error);
      return [];
    }
  }

  /**
   * Get information about a specific NFT
   * @param tokenId - The ID of the NFT
   * @returns The NFT info or error message
   */
  public static async getNFTInfo(
    tokenId: bigint
  ): Promise<{ success: boolean; nft?: NFTInfo; error?: string }> {
    try {
      const actor = await this.getActor();
      const result: Result_16 = await actor.getNFTInfo(tokenId);

      if ('ok' in result) {
        return { success: true, nft: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error getting NFT info:', error);
      return { success: false, error: 'Failed to get NFT info' };
    }
  }

  /**
   * Get the owner of an NFT
   * @param tokenId - The ID of the NFT
   * @returns The owner response or error message
   */
  public static async getNFTOwner(
    tokenId: bigint
  ): Promise<{ success: boolean; owner?: NFTOwnerResponse; error?: string }> {
    try {
      const actor = await this.getActor();
      const result: Result_15 = await actor.getNFTOwner(tokenId);

      if ('ok' in result) {
        return { success: true, owner: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error getting NFT owner:', error);
      return { success: false, error: 'Failed to get NFT owner' };
    }
  }

  /**
   * Get the NFT balance for an account
   * @param account - The NFT account
   * @returns The balance response or error message
   */
  public static async getNFTBalance(account: NFTAccount): Promise<{
    success: boolean;
    balance?: NFTBalanceResponse;
    error?: string;
  }> {
    try {
      const actor = await this.getActor();
      const result: Result_17 = await actor.getNFTBalance(account);

      if ('ok' in result) {
        return { success: true, balance: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error getting NFT balance:', error);
      return { success: false, error: 'Failed to get NFT balance' };
    }
  }

  /**
   * Mint a new NFT
   * @param request - The mint NFT request
   * @returns The mint response or error message
   */
  public static async mintNFT(
    request: MintNFTRequest
  ): Promise<{ success: boolean; response?: MintNFTResponse; error?: string }> {
    try {
      const actor = await this.getActor();
      const result: Result_8 = await actor.mintNFT(request);

      if ('ok' in result) {
        return { success: true, response: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
      return { success: false, error: 'Failed to mint NFT' };
    }
  }

  /**
   * Check if an NFT can be minted for a startup
   * @param startupId - The ID of the startup
   * @returns True if NFT can be minted, false otherwise
   */
  public static async canMintNFT(startupId: string): Promise<boolean> {
    try {
      const actor = await this.getActor();
      const result: Result_24 = await actor.canMintNFT(startupId);
      return 'ok' in result ? result.ok : false;
    } catch (error) {
      console.error('Error checking if NFT can be minted:', error);
      return false;
    }
  }

  /**
   * Transfer an NFT to another account
   * @param request - The transfer NFT request
   * @returns The transfer response or error message
   */
  public static async transferNFT(request: TransferNFTRequest): Promise<{
    success: boolean;
    response?: TransferNFTResponse;
    error?: string;
  }> {
    try {
      const actor = await this.getActor();
      const result: Result_2 = await actor.transferNFT(request);

      if ('ok' in result) {
        return { success: true, response: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error transferring NFT:', error);
      return { success: false, error: 'Failed to transfer NFT' };
    }
  }

  /**
   * Get NFT collection information
   * @returns NFT collection configuration
   */
  public static async getCollectionInfo(): Promise<NFTConfig | null> {
    try {
      const actor = await this.getActor();
      return await actor.getCollectionInfo();
    } catch (error) {
      console.error('Error getting collection info:', error);
      return null;
    }
  }

  /**
   * Get NFT statistics
   * @returns NFT statistics
   */
  public static async getNFTStats(): Promise<{
    totalSupply: bigint;
    totalStartups: bigint;
    nextTokenId: bigint;
  } | null> {
    try {
      const actor = await this.getActor();
      return await actor.getNFTStats();
    } catch (error) {
      console.error('Error getting NFT stats:', error);
      return null;
    }
  }
}
