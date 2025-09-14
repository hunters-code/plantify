import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { backendService } from './backend';

export interface AuthState {
  isAuthenticated: boolean;
  principal: Principal | null;
  isLoading: boolean;
}

export class AuthService {
  private authClient: AuthClient | null = null;
  private principal: Principal | null = null;

  async initialize(): Promise<void> {
    this.authClient = await AuthClient.create();

    const isAuthenticated = await this.authClient.isAuthenticated();
    if (isAuthenticated) {
      this.principal = this.authClient.getIdentity().getPrincipal();
      await backendService.initialize(this.authClient.getIdentity());
    }
  }

  async signIn(): Promise<Principal | null> {
    if (!this.authClient) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      this.authClient!.login({
        identityProvider: 'https://identity.ic0.app',
        onSuccess: async () => {
          this.principal = this.authClient!.getIdentity().getPrincipal();
          try {
            await backendService.initialize(this.authClient!.getIdentity());
            resolve(this.principal);
          } catch (error) {
            console.error('Failed to initialize backend:', error);
            reject(error);
          }
        },
        onError: error => {
          console.error('Sign in failed:', error);
          reject(error);
        },
      });
    });
  }

  async signOut(): Promise<void> {
    if (this.authClient) {
      await this.authClient.logout();
      this.principal = null;
    }
  }

  getPrincipal(): Principal | null {
    return this.principal;
  }

  isAuthenticated(): boolean {
    return this.principal !== null;
  }

  getIdentity() {
    return this.authClient?.getIdentity();
  }
}

export const authService = new AuthService();
