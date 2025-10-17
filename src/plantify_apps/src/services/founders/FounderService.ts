import type {
  Founder,
  FounderRegistrationRequest,
  Result_5,
  Startup,
  StartupCreationRequest,
  DashboardOverview,
  StartupOverview,
} from '@/declarations/plantify_backend/plantify_backend.did';

import { BaseService } from '../BaseService';

/**
 * Service for founder-related operations
 */
export class FounderService extends BaseService {
  /**
   * Register a new founder
   * @param request - The founder registration request
   * @returns The registered founder or error message
   */
  public static async registerFounder(
    request: FounderRegistrationRequest
  ): Promise<{ success: boolean; founder?: Founder; error?: string }> {
    try {
      const actor = await this.getActor();
      const result: Result_5 = await actor.registerFounder(request);

      if ('ok' in result) {
        return { success: true, founder: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error registering founder:', error);
      return { success: false, error: 'Failed to register founder' };
    }
  }

  /**
   * Get the current founder's information
   * @returns The founder information or null if not found
   */
  public static async getFounderByPrincipal(): Promise<Founder | null> {
    try {
      const actor = await this.getActor();
      const founderOpt = await actor.getFounderByPrincipal();
      return founderOpt.length ? founderOpt[0] : null;
    } catch (error) {
      console.error('Error getting founder by principal:', error);
      return null;
    }
  }

  /**
   * Create a new startup
   * @param request - The startup creation request
   * @returns The created startup or error message
   */
  public static async createStartup(
    request: StartupCreationRequest
  ): Promise<{ success: boolean; startup?: Startup; error?: string }> {
    try {
      const actor = await this.getActor();
      const result = await actor.createStartup(request);

      if ('ok' in result) {
        return { success: true, startup: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error creating startup:', error);
      return { success: false, error: 'Failed to create startup' };
    }
  }

  /**
   * Get all startups created by the current founder
   * @returns Array of startups
   */
  public static async getFounderStartups(): Promise<Startup[]> {
    try {
      const actor = await this.getActor();
      const startups = await actor.getStartupsByFounderPrincipal();
      return startups;
    } catch (error) {
      console.error('Error getting founder startups:', error);
      return [];
    }
  }

  /**
   * Update a startup's status
   * @param startupId - The ID of the startup
   * @param newStatus - The new status
   * @returns True if update was successful
   */
  public static async updateStartupStatus(
    startupId: string,
    newStatus: string
  ): Promise<boolean> {
    try {
      const actor = await this.getActor();
      return await actor.updateStartupStatus(startupId, newStatus);
    } catch (error) {
      console.error('Error updating startup status:', error);
      return false;
    }
  }

  /**
   * Get dashboard overview statistics for the current founder
   * @returns Dashboard overview data or error message
   */
  public static async getFounderDashboardOverview(): Promise<{
    success: boolean;
    data?: DashboardOverview;
    error?: string;
  }> {
    try {
      const actor = await this.getActor();
      const result = await actor.getFounderDashboardOverview();

      if ('Success' in result) {
        return { success: true, data: result.Success };
      } else if ('Error' in result) {
        return { success: false, error: result.Error };
      }

      // Default fallback
      return { success: false, error: 'Unknown response format' };
    } catch (error) {
      console.error('Error getting founder dashboard overview:', error);
      return { success: false, error: 'Failed to fetch dashboard overview' };
    }
  }

  /**
   * Get overview data for a specific startup
   * @param startupId - The ID of the startup
   * @returns Startup overview data or error message
   */
  public static async getFounderStartupOverview(startupId: string): Promise<{
    success: boolean;
    data?: StartupOverview;
    error?: string;
  }> {
    try {
      const actor = await this.getActor();
      const result = await actor.getFounderStartupOverview(startupId);

      if ('Success' in result) {
        return { success: true, data: result.Success };
      } else if ('Error' in result) {
        return { success: false, error: result.Error };
      }

      // Default fallback
      return { success: false, error: 'Unknown response format' };
    } catch (error) {
      console.error('Error getting founder startup overview:', error);
      return { success: false, error: 'Failed to fetch startup overview' };
    }
  }
}
