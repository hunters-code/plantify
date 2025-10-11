import { HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

import { createActor, canisterId } from '@/declarations/plantify_backend';
import type { _SERVICE } from '@/declarations/plantify_backend/plantify_backend.did';

/**
 * Base service class that provides access to the backend canister
 */
export class BaseService {
  private static actor: _SERVICE | null = null;
  private static agent: HttpAgent | null = null;
  // Fallback canister ID for production
  private static readonly FALLBACK_CANISTER_ID = 'a5ptu-ryaaa-aaaai-q32cq-cai';
  /**
   * Initialize the service with an identity
   * @param authClient - The authentication client
   * @returns A promise that resolves to true if initialization was successful
   */
  public static async initialize(authClient?: AuthClient): Promise<boolean> {
    try {
      // If no auth client provided, use anonymous actor
      if (!authClient) {
        console.log(
          'No auth client provided, initializing with anonymous actor'
        );
        this.actor = await this.createAnonymousActor();
        this.agent = null; // Anonymous actor manages its own agent
        return true;
      }

      // Use canister ID from declarations or fallback
      const effectiveCanisterId = canisterId || this.FALLBACK_CANISTER_ID;

      if (!effectiveCanisterId) {
        console.error('Canister ID is not available');
        return false;
      }

      console.log('Using canister ID:', effectiveCanisterId);

      this.agent = new HttpAgent({
        host: 'https://ic0.app',
        identity: authClient.getIdentity(),
      });

      this.actor = createActor(effectiveCanisterId, {
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
      throw new Error(
        'Actor not initialized. Call BaseService.initialize() first.'
      );
    }
    return this.actor;
  }

  /**
   * Get the actor instance for external use
   * @returns The actor instance
   * @throws Error if the actor is not initialized
   */
  public static getActorInstance(): _SERVICE {
    return this.getActor();
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

  /**
   * Create an anonymous actor for public operations
   * @returns Anonymous actor instance
   */
  public static async createAnonymousActor(): Promise<_SERVICE> {
    try {
      const anonymousAgent = new HttpAgent({ host: 'https://ic0.app' });

      // Fetch root key in development
      if (
        process.env.NODE_ENV !== 'production' ||
        (typeof window !== 'undefined' &&
          window.location.hostname === 'localhost')
      ) {
        await anonymousAgent.fetchRootKey();
      }

      // Use canister ID from declarations or fallback
      const effectiveCanisterId = canisterId || this.FALLBACK_CANISTER_ID;

      if (!effectiveCanisterId) {
        throw new Error('Canister ID is not available');
      }

      const anonymousActor = createActor(effectiveCanisterId, {
        agent: anonymousAgent,
      }) as _SERVICE;

      return anonymousActor;
    } catch (error) {
      console.error('Failed to create anonymous actor:', error);
      throw error;
    }
  }
}
