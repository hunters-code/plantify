import { BaseService } from './BaseService';

/**
 * Service for handling authentication and user type operations
 */
export class AuthService extends BaseService {
  /**
   * Check if the current user is a founder
   * @returns True if the user is a founder
   */
  public static async isUserFounder(): Promise<boolean> {
    try {
      const actor = await this.getActor();
      return await actor.isUserFounder();
    } catch (error) {
      console.error('Error checking if user is founder:', error);
      return false;
    }
  }

  /**
   * Check if the current user is an investor
   * @returns True if the user is an investor
   */
  public static async isUserInvestor(): Promise<boolean> {
    try {
      const actor = await this.getActor();
      return await actor.isUserInvestor();
    } catch (error) {
      console.error('Error checking if user is investor:', error);
      return false;
    }
  }

  /**
   * Get the current user type (founder or investor)
   * @returns The user type or null if not registered
   */
  public static async getUserType(): Promise<'founder' | 'investor' | null> {
    try {
      const actor = await this.getActor();
      const userTypeOpt = await actor.getUserType();

      if (!userTypeOpt.length) {
        return null;
      }

      const userType = userTypeOpt[0];
      if ('Founder' in userType) {
        return 'founder';
      } else if ('Investor' in userType) {
        return 'investor';
      }

      return null;
    } catch (error) {
      console.error('Error getting user type:', error);
      return null;
    }
  }

  /**
   * Check if the user is registered (either as a founder or investor)
   * @returns True if the user is registered
   */
  public static async isUserRegistered(): Promise<boolean> {
    try {
      const isFounder = await this.isUserFounder();
      const isInvestor = await this.isUserInvestor();
      return isFounder || isInvestor;
    } catch (error) {
      console.error('Error checking if user is registered:', error);
      return false;
    }
  }
}
