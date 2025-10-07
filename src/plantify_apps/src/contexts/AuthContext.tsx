'use client';

import { HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { createActor } from '@/declarations/plantify_backend';
import type { _SERVICE } from '@/declarations/plantify_backend/plantify_backend.did';

type UserType = 'investor' | 'founder' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isRegistered: boolean;
  userType: UserType;
  signIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);

  // Auth client state
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [actor, setActor] = useState<_SERVICE | null>(null);

  // Canister ID for the backend
  const canisterId = process.env.CANISTER_ID || '';

  // Initialize auth client on component mount
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

          // Create backend actor
          await createBackendActor(client);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Check user type and registration status when authenticated
  useEffect(() => {
    const checkUserStatus = async () => {
      if (isAuthenticated && actor) {
        setIsLoading(true);
        try {
          // Check if user is registered as founder or investor
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
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkUserStatus();
  }, [isAuthenticated, actor]);

  // Create backend actor function
  const createBackendActor = async (client: AuthClient) => {
    try {
      const newAgent = new HttpAgent({
        host: 'https://ic0.app',
        identity: client.getIdentity(),
      });

      // Fetch root key in development
      if (process.env.NODE_ENV !== 'production' || window.location.hostname === 'localhost') {
        await newAgent.fetchRootKey();
      }

      const newActor = createActor(canisterId, {
        agent: newAgent,
      }) as _SERVICE;

      setActor(newActor);
      return true;
    } catch (error) {
      console.error('Error creating backend actor:', error);
      return false;
    }
  };

  // Sign in function
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

            await createBackendActor(authClient);
            resolve();
          } catch (error) {
            console.error('Sign in error:', error);
            reject(error);
          } finally {
            setIsLoading(false);
          }
        },
        onError: (error) => {
          console.error('Login error:', error);
          setIsLoading(false);
          reject(error);
        },
        windowOpenerFeatures:
          'toolbar=0,location=0,menubar=0,width=500,height=600,left=100,top=100',
      });
    });
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, isRegistered, userType, signIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
