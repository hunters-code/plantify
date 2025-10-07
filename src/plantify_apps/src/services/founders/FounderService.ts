import type {
  Founder,
  FounderRegistrationRequest,
  Result_5,
  Startup,
  StartupCreationRequest,
  Result_23,
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
  public static async registerFounder(request: FounderRegistrationRequest): Promise<{ success: boolean; founder?: Founder; error?: string }> {
    try {
      const result: Result_5 = await this.getActor().registerFounder(request);

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
      const founderOpt = await this.getActor().getFounderByPrincipal();
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
  public static async createStartup(request: StartupCreationRequest): Promise<{ success: boolean; startup?: Startup; error?: string }> {
    try {
      const result: Result_23 = await this.getActor().createStartup(request);

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
      const founder = await this.getFounderByPrincipal();
      if (!founder) {
        return [];
      }

      const allStartups = await this.getActor().getAllStartups();
      return allStartups.filter(startup => startup.founderId === founder.id);
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
  public static async updateStartupStatus(startupId: string, newStatus: string): Promise<boolean> {
    try {
      return await this.getActor().updateStartupStatus(startupId, newStatus);
    } catch (error) {
      console.error('Error updating startup status:', error);
      return false;
    }
  }
}
