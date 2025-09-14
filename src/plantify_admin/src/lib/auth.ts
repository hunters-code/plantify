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
  private isInitialized: boolean = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    this.authClient = await AuthClient.create();
    
    const isAuthenticated = await this.authClient.isAuthenticated();
    if (isAuthenticated) {
      this.principal = this.authClient.getIdentity().getPrincipal();
      await backendService.initialize(this.authClient.getIdentity());
    }
    
    this.isInitialized = true;
  }

  async signIn(): Promise<Principal | null> {
    if (!this.authClient) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const identityProvider = 'https://id.ai/#authorize'

      this.authClient!.login({
        identityProvider,
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
        onError: (error) => {
          console.error('Sign in failed:', error);
          reject(error);
        },
        windowOpenerFeatures: "toolbar=0,location=0,menubar=0,width=500,height=600,left=100,top=100",
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

  // Enhanced method to get user info
  async getUserInfo() {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      const principal = this.getPrincipal();
      return {
        principal: principal?.toString(),
        isAnonymous: principal?.isAnonymous(),
        // Add more user info as needed
      };
    } catch (error) {
      console.error('Failed to get user info:', error);
      return null;
    }
  }

  // Method to check if user is registered in the system
  async isUserRegistered() {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      // This would call your backend method to check if user is registered
      // You'll need to implement this method in your backend
      return true; // Placeholder
    } catch (error) {
      console.error('Failed to check user registration:', error);
      return false;
    }
  }
}

export const authService = new AuthService();
