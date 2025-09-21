import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { HttpAgent } from '@dfinity/agent';
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
  private canisterId: string = 'a5ptu-ryaaa-aaaai-q32cq-cai';

  private loadedIdlFactory: IDL.InterfaceFactory | null = idlFactory;

  constructor() {}

  async initialize() {
    if (this.isInitialized) return;

    try {
      this.authClient = await AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true,
        },
      });

      const isAuthenticated = await this.authClient.isAuthenticated();

      if (isAuthenticated) {
        this.principal = this.authClient.getIdentity().getPrincipal();

        this.createBackendActor()
          .then(success => {})
          .catch(err => {});
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize auth service:', error);
      this.isInitialized = true;
    }
  }

  async createBackendActor() {
    if (!this.authClient) return false;

    try {
      this.agent = new HttpAgent({
        host: 'https://ic0.app',
        identity: this.authClient.getIdentity(),
      });

      if (
        process.env.NODE_ENV !== 'production' ||
        window.location.hostname === 'localhost'
      ) {
        await this.agent.fetchRootKey();
      }

      this.actor = createActor(this.canisterId, {
        agent: this.agent,
      }) as _SERVICE;

      try {
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
      };
    } catch (error) {
      return null;
    }
  }

  async isUserRegistered() {
    if (!this.isAuthenticated()) {
      return false;
    }

    if (!this.actor) {
      return false;
    }

    try {
      const isFounder = await this.isUserFounder();
      const isInvestor = await this.isUserInvestor();
      return isFounder || isInvestor;
    } catch (error) {
      return false;
    }
  }

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

  async initializeBackendActor() {
    return await this.createBackendActor();
  }
}

export const authService = new AuthService();
