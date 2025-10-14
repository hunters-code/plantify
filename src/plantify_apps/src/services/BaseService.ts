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
  private static readonly FALLBACK_CANISTER_ID = 'oncwy-yqaaa-aaaae-qfzja-cai';
  /**
   * Initialize the service with an identity
   * @param authClient - The authentication client
   * @returns A promise that resolves to true if initialization was successful
   */
  public static async initialize(authClient?: AuthClient): Promise<boolean> {
    try {
      // If no auth client provided, use anonymous actor
      if (!authClient) {
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
   * Ensure the service is initialized before making any calls
   * @returns Promise that resolves when service is ready
   */
  public static async ensureInitialized(): Promise<void> {
    if (this.actor) {
      return;
    }

    // Try to initialize with anonymous actor if not already initialized
    try {
      await this.initialize();
    } catch (error) {
      console.error('Failed to ensure initialization:', error);
      throw new Error('Service initialization failed');
    }
  }

  /**
   * Execute a service method with automatic initialization
   * This method should be used to wrap all service method calls
   * @param method - The service method to execute
   * @param args - Arguments to pass to the method
   * @returns The result of the method execution
   */
  protected static async executeWithInitialization<T>(
    method: (...args: any[]) => Promise<T>,
    ...args: any[]
  ): Promise<T> {
    await this.ensureInitialized();
    return await method.apply(this, args);
  }

  /**
   * Get the actor instance with automatic initialization
   * This method automatically ensures initialization before returning the actor
   * @returns The actor instance
   * @throws Error if the actor cannot be initialized after retries
   */
  protected static async getActor(): Promise<_SERVICE> {
    // Always ensure initialization before returning actor
    await this.ensureInitialized();

    if (this.actor) {
      return this.actor;
    }

    // Wait for initialization with retry mechanism
    const maxRetries = 50; // 5 seconds total (50 * 100ms)
    let retries = 0;

    while (!this.actor && retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 100));
      retries++;
    }

    if (!this.actor) {
      throw new Error(
        'Actor not initialized. Please ensure you are authenticated and try again.'
      );
    }

    return this.actor;
  }

  /**
   * Get the actor instance for external use
   * @returns The actor instance
   * @throws Error if the actor is not initialized
   */
  public static async getActorInstance(): Promise<_SERVICE> {
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
      const actor = await this.getActor();
      const principal = await actor.whoami();
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

  /**
   * Clear the current actor and agent
   * This should be called when signing out to prevent using stale authentication
   */
  public static clear(): void {
    this.actor = null;
    this.agent = null;
  }
}
