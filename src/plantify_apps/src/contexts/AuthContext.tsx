'use client';

import { AuthClient } from '@dfinity/auth-client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

import type { _SERVICE } from '@/declarations/plantify_backend/plantify_backend.did';
import { BaseService } from '@/services/BaseService';

type UserType = 'investor' | 'founder' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isRegistered: boolean;
  userType: UserType;
  principal: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [principal, setPrincipal] = useState<string | null>(null);

  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [actor, setActor] = useState<_SERVICE | null>(null);

  const createBackendActor = useCallback(async (client: AuthClient) => {
    try {
      const success = await BaseService.initialize(client);
      if (success) {
        const serviceActor = BaseService.getActorInstance();
        setActor(serviceActor);
        return true;
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

          const identity = client.getIdentity();
          const principalId = identity.getPrincipal().toString();
          setPrincipal(principalId);

          await createBackendActor(client);
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
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkUserStatus();
  }, [isAuthenticated, actor]);

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

            const identity = authClient.getIdentity();
            const principalId = identity.getPrincipal().toString();
            setPrincipal(principalId);

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

      setIsAuthenticated(false);
      setIsRegistered(false);
      setUserType(null);
      setPrincipal(null);
      setActor(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        isRegistered,
        userType,
        principal,
        signIn,
        signOut,
      }}
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
