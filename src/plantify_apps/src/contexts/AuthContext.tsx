'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

import { Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

import type { _SERVICE } from '@/declarations/plantify_backend/plantify_backend.did';
import { BaseService } from '@/services/BaseService';

type UserType = 'investor' | 'founder' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isRegistered: boolean;
  userType: UserType;
  principal: string | null;
  identity: Identity | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  getIdentity: () => Identity | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);

  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [actor, setActor] = useState<_SERVICE | null>(null);

  const createBackendActor = useCallback(async (client: AuthClient) => {
    try {
      // Clear any existing actor/agent before initializing with new identity
      BaseService.clear();

      const success = await BaseService.initialize(client);
      if (success) {
        const serviceActor = await BaseService.getActorInstance();
        setActor(serviceActor);
      }
      return false;
    } catch (error) {
      console.error('Error creating backend actor:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const client = await AuthClient.create({
          idleOptions: {
            disableIdle: true,
            disableDefaultIdleCallback: true,
          },
        });

        setAuthClient(client);

        const isAuth = await client.isAuthenticated();
        if (isAuth) {
          setIsAuthenticated(true);

          const userIdentity = client.getIdentity();
          const principalId = userIdentity.getPrincipal().toString();
          setPrincipal(principalId);
          setIdentity(userIdentity);

          await createBackendActor(client);
        } else {
          // Initialize BaseService for anonymous users
          try {
            await BaseService.initialize();
          } catch (error) {
            console.error(
              'Error initializing BaseService for anonymous user:',
              error
            );
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [createBackendActor]);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (isAuthenticated && actor) {
        setIsLoading(true);
        try {
          const isFounder = await actor.isUserFounder();
          const isInvestor = await actor.isUserInvestor();

          setIsRegistered(isFounder || isInvestor);

          if (isFounder) {
            setUserType('founder');
          } else if (isInvestor) {
            setUserType('investor');
          } else {
            setUserType(null);
          }
        } catch (error) {
          console.error('Error checking user status:', error);

          // Handle signature verification errors
          if (
            error instanceof Error &&
            error.message.includes('Invalid signature')
          ) {
            console.warn(
              'Signature verification failed, attempting to re-authenticate...'
            );

            // Clear the current authentication state
            BaseService.clear();
            setIsAuthenticated(false);
            setIsRegistered(false);
            setUserType(null);
            setPrincipal(null);
            setActor(null);

            // Try to re-authenticate
            try {
              if (authClient) {
                await authClient.logout();
              }
            } catch (logoutError) {
              console.error('Error during logout:', logoutError);
            }
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkUserStatus();
  }, [isAuthenticated, actor, authClient]);

  const signIn = async (): Promise<void> => {
    if (!authClient) {
      throw new Error('Auth client not initialized');
    }

    setIsLoading(true);

    return new Promise((resolve, reject) => {
      const identityProvider = 'https://id.ai/#authorize';

      authClient.login({
        identityProvider,
        onSuccess: async () => {
          try {
            setIsAuthenticated(true);

            const userIdentity = authClient.getIdentity();
            const principalId = userIdentity.getPrincipal().toString();
            setPrincipal(principalId);
            setIdentity(userIdentity);

            await createBackendActor(authClient);
            resolve();
          } catch (error) {
            console.error('Sign in error:', error);
            reject(error);
          } finally {
            setIsLoading(false);
          }
        },
        onError: error => {
          console.error('Login error:', error);
          setIsLoading(false);
          reject(error);
        },
        windowOpenerFeatures:
          'toolbar=0,location=0,menubar=0,width=500,height=600,left=100,top=100',
      });
    });
  };

  const signOut = async (): Promise<void> => {
    if (!authClient) {
      throw new Error('Auth client not initialized');
    }

    setIsLoading(true);

    try {
      await authClient.logout();

      // Clear the backend service to prevent using stale authentication
      BaseService.clear();

      setIsAuthenticated(false);
      setIsRegistered(false);
      setUserType(null);
      setPrincipal(null);
      setIdentity(null);
      setActor(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getIdentity = (): Identity | null => {
    return identity;
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    isRegistered,
    userType,
    principal,
    identity,
    signIn,
    signOut,
    getIdentity,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
