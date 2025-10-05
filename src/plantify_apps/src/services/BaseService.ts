import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';
import { createActor } from '@/declarations/plantify_backend';
import type { _SERVICE } from '@/declarations/plantify_backend/plantify_backend.did';

/**
 * Base service class that provides access to the backend canister
 */
export class BaseService {
  private static actor: _SERVICE | null = null;
  private static agent: HttpAgent | null = null;
  protected static canisterId: string = 'a5ptu-ryaaa-aaaai-q32cq-cai';

  /**
   * Initialize the service with an identity
   * @param authClient - The authentication client
   * @returns A promise that resolves to true if initialization was successful
   */
  public static async initialize(authClient: AuthClient): Promise<boolean> {
    try {
      if (!authClient) {
        console.error('Auth client is required');
        return false;
      }

      this.agent = new HttpAgent({
        host: 'https://ic0.app',
        identity: authClient.getIdentity(),
      });

      // Fetch root key in development
      if (process.env.NODE_ENV !== 'production' || window.location.hostname === 'localhost') {
        await this.agent.fetchRootKey();
      }

      this.actor = createActor(this.canisterId, {
        agent: this.agent,
      }) as _SERVICE;

      return true;
    } catch (error) {
      console.error('Failed to initialize service:', error);
      this.agent = null;
      this.actor = null;
      return false;
    }
  }

  /**
   * Get the actor instance
   * @returns The actor instance
   * @throws Error if the actor is not initialized
   */
  protected static getActor(): _SERVICE {
    if (!this.actor) {
      throw new Error('Actor not initialized. Call BaseService.initialize() first.');
    }
    return this.actor;
  }

  /**
   * Check if the service is initialized
   * @returns True if the service is initialized
   */
  public static isInitialized(): boolean {
    return this.actor !== null;
  }

  /**
   * Get the current principal ID
   * @returns The principal ID as a string
   */
  public static async whoami(): Promise<string> {
    try {
      const principal = await this.getActor().whoami();
      return principal.toString();
    } catch (error) {
      console.error('Error getting principal:', error);
      throw error;
    }
  }
}
