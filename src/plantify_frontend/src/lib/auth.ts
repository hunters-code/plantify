import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { HttpAgent, Actor } from '@dfinity/agent';
import { idlFactory, createActor } from '../declarations/plantify_backend';
import type { _SERVICE } from '../declarations/plantify_backend/plantify_backend.did';
import type { IDL } from '@dfinity/candid';

export interface AuthState {
  isAuthenticated: boolean;
  principal: Principal | null;
  isLoading: boolean;
}

export class AuthService {
  private authClient: AuthClient | null = null;
  private principal: Principal | null = null;
  private actor: _SERVICE | null = null;
  private agent: HttpAgent | null = null;
  private isInitialized: boolean = false;
  private canisterId: string = 'a5ptu-ryaaa-aaaai-q32cq-cai'; // Production plantify_backend canister ID

  // Properties for handling backend declarations directly
  private loadedIdlFactory: IDL.InterfaceFactory | null = idlFactory;

  constructor() {
    // Properties are now declared above
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Create auth client with faster timeout
      this.authClient = await AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true,
        },
      });

      // Check if user is already authenticated
      const isAuthenticated = await this.authClient.isAuthenticated();

      if (isAuthenticated) {
        this.principal = this.authClient.getIdentity().getPrincipal();

        // Create backend actor in background
        this.createBackendActor()
          .then(success => {})
          .catch(err => {});
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize auth service:', error);
      this.isInitialized = true; // Still mark as initialized to prevent further attempts
    }
  }

  async createBackendActor() {
    if (!this.authClient) return false;

    try {
      // Create a new agent
      this.agent = new HttpAgent({
        host: 'https://ic0.app', // Always use IC mainnet
        identity: this.authClient.getIdentity(),
      });

      // No need to fetch root key when using mainnet
      // The agent will use the well-known key for the IC mainnet

      // Create the actor using the agent and canister ID
      this.actor = createActor(this.canisterId, {
        agent: this.agent,
      }) as _SERVICE;

      // Test if the actor is working by calling a simple method
      try {
        const principal = await this.actor.whoami();
        return true;
      } catch (error) {
        return false;
      }
    } catch (error) {
      this.agent = null;
      this.actor = null;
      return false;
    }
  }

  async signIn() {
    if (!this.authClient) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const identityProvider = 'https://id.ai/#authorize';

      this.authClient!.login({
        identityProvider,
        onSuccess: async () => {
          try {
            this.principal = this.authClient!.getIdentity().getPrincipal();
            // Create backend actor after successful login
            await this.createBackendActor();
            resolve(this.principal);
          } catch (error) {
            reject(error);
          }
        },
        onError: (error: any) => {
          reject(error);
        },
        windowOpenerFeatures:
          'toolbar=0,location=0,menubar=0,width=500,height=600,left=100,top=100',
      });
    });
  }

  async signOut() {
    if (this.authClient) {
      await this.authClient.logout();
      this.principal = null;
      this.actor = null;
      this.agent = null;
    }
  }

  getPrincipal() {
    return this.principal;
  }

  isAuthenticated() {
    return this.principal !== null;
  }

  getIdentity() {
    return this.authClient?.getIdentity();
  }

  getActor() {
    return this.actor;
  }

  getAgent() {
    return this.agent;
  }

  // Enhanced method to get user info
  async getUserInfo() {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      const principal = this.getPrincipal();
      if (!principal) {
        return null;
      }

      return {
        principal: principal.toString(),
        isAnonymous: principal.isAnonymous(),
        // Add more user info as needed
      };
    } catch (error) {
      return null;
    }
  }

  // Method to check if user is registered in the system
  async isUserRegistered() {
    if (!this.isAuthenticated()) {
      return false;
    }

    if (!this.actor) {
      return false;
    }

    try {
      // Check if user is either a founder or investor
      const isFounder = await this.isUserFounder();
      const isInvestor = await this.isUserInvestor();
      return isFounder || isInvestor;
    } catch (error) {
      return false;
    }
  }

  // Method to check if user is a founder
  async isUserFounder() {
    if (!this.isAuthenticated() || !this.actor) {
      return false;
    }

    try {
      const founders = await this.actor.getFounders();
      const currentPrincipal = this.principal?.toString();

      return founders.some(
        founder => founder.principal.toString() === currentPrincipal
      );
    } catch (error) {
      return false;
    }
  }

  // Method to check if user is an investor
  async isUserInvestor() {
    if (!this.isAuthenticated() || !this.actor) {
      return false;
    }

    try {
      const investors = await this.actor.getInvestors();
      const currentPrincipal = this.principal?.toString();

      return investors.some(
        (investor: any) => investor.principal.toString() === currentPrincipal
      );
    } catch (error) {
      return false;
    }
  }

  // Method to get user type
  async getUserType() {
    if (!this.isAuthenticated() || !this.actor) {
      return null;
    }

    try {
      const isFounder = await this.isUserFounder();
      if (isFounder) return 'founder';

      const isInvestor = await this.isUserInvestor();
      if (isInvestor) return 'investor';

      return null;
    } catch (error) {
      return null;
    }
  }

  // Methods for backend declarations - now handled directly
  isBackendDeclarationsAvailable() {
    return this.loadedIdlFactory !== null;
  }

  setBackendDeclarations(factory: IDL.InterfaceFactory) {
    this.loadedIdlFactory = factory;
  }

  loadBackendDeclarations() {
    if (this.loadedIdlFactory) {
      return { idlFactory: this.loadedIdlFactory };
    }

    return { idlFactory: null };
  }

  // Method to initialize backend actor
  async initializeBackendActor() {
    return await this.createBackendActor();
  }
}

// Create and export a singleton instance
export const authService = new AuthService();
