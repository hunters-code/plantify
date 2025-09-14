import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { HttpAgent, Actor } from '@dfinity/agent';

export class AuthService {
  constructor() {
    this.authClient = null;
    this.principal = null;
    this.actor = null;
    this.agent = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      this.authClient = await AuthClient.create();
      
      const isAuthenticated = await this.authClient.isAuthenticated();
      if (isAuthenticated) {
        this.principal = this.authClient.getIdentity().getPrincipal();
        await this.initializeBackend();
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize auth service:', error);
      throw error;
    }
  }

  async initializeBackend() {
    if (!this.authClient) return;
    
    try {
       this.agent = new HttpAgent({
        host: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:4943' 
          : 'https://ic0.app',
        identity: this.authClient.getIdentity(),
      });

      // For development, fetch root key
      if (process.env.NODE_ENV === 'development') {
        await this.agent.fetchRootKey();
      }

      // Actor will be null until backend declarations are generated
      this.actor = null;
    } catch (error) {
      console.error('Failed to initialize backend:', error);
      // Don't throw error - allow authentication to work without backend
      console.warn('Authentication will work, but backend calls will not be available.');
    }
  }

  async signIn() {
    if (!this.authClient) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const identityProvider = 'https://id.ai/#authorize';

      this.authClient.login({
        identityProvider,
        onSuccess: async () => {
          try {
            this.principal = this.authClient.getIdentity().getPrincipal();
            await this.initializeBackend();
            resolve(this.principal);
          } catch (error) {
            console.error('Failed to initialize after sign in:', error);
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
      return {
        principal: principal.toString(),
        isAnonymous: principal.isAnonymous(),
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

    if (!this.actor) {
      console.warn('Backend actor not available. User registration status cannot be checked.');
      return false;
    }

    try {
      // This would call your backend method to check if user is registered
      // You'll need to implement this method in your backend
      // For now, return true as a placeholder
      return true;
    } catch (error) {
      console.error('Failed to check user registration:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
export const authService = new AuthService();
