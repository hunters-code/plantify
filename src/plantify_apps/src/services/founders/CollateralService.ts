import type {
  CollateralInfo,
  CollateralProgress,
  CollateralProgressResponse,
  CollateralDashboard,
  CollateralDashboardResponse,
  Result_20,
  Result_21,
  CollateralTopUp,
} from '@/declarations/plantify_backend/plantify_backend.did';

import { BaseService } from '../BaseService';

/**
 * Service for collateral-related operations
 */
export class CollateralService extends BaseService {
  /**
   * Get collateral status for a startup
   * @param startupId - The ID of the startup
   * @returns The collateral info or error message
   */
  public static async getCollateralStatus(startupId: string): Promise<{
    success: boolean;
    collateral?: CollateralInfo;
    error?: string;
  }> {
    try {
      const actor = await this.getActor();
      const result: Result_21 = await actor.getCollateralStatus(startupId);

      if ('ok' in result) {
        return { success: true, collateral: result.ok };
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
   * @returns The collateral progress or error message
   */
  public static async getCollateralProgress(startupId: string): Promise<{
    success: boolean;
    progress?: CollateralProgress;
    error?: string;
  }> {
    try {
      const actor = await this.getActor();
      const result: CollateralProgressResponse =
        await actor.getCollateralProgress(startupId);

      if ('Success' in result) {
        return { success: true, progress: result.Success };
      } else {
        return { success: false, error: result.Error };
      }
    } catch (error) {
      console.error('Error getting collateral progress:', error);
      return { success: false, error: 'Failed to get collateral progress' };
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
      const result: Result_20 =
        await actor.getCollateralTopUpHistory(startupId);

      if ('ok' in result) {
        return { success: true, history: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error getting collateral top-up history:', error);
      return {
        success: false,
        error: 'Failed to get collateral top-up history',
      };
    }
  }

  /**
   * Get all collateral information
   * @returns Array of all collateral info
   */
  public static async getAllCollateralInfo(): Promise<CollateralInfo[]> {
    try {
      const actor = await this.getActor();
      return await actor.getAllCollateralInfo();
    } catch (error) {
      console.error('Error getting all collateral info:', error);
      return [];
    }
  }

  /**
   * Get collateral dashboard for a startup
   * @param startupId - The ID of the startup
   * @returns The collateral dashboard data or error message
   */
  public static async getCollateralDashboard(startupId: string): Promise<{
    success: boolean;
    dashboard?: CollateralDashboard;
    error?: string;
  }> {
    try {
      const actor = await this.getActor();
      const result: CollateralDashboardResponse =
        await actor.getCollateralDashboard(startupId);

      if ('Success' in result) {
        return { success: true, dashboard: result.Success };
      } else {
        return { success: false, error: result.Error };
      }
    } catch (error) {
      console.error('Error getting collateral dashboard:', error);
      return { success: false, error: 'Failed to get collateral dashboard' };
    }
  }
}
