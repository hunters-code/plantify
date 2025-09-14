"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, AuthState } from '../lib/auth';

interface AuthContextType extends AuthState {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  isUserRegistered: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    principal: null,
    isLoading: true,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await authService.initialize();
        setAuthState({
          isAuthenticated: authService.isAuthenticated(),
          principal: authService.getPrincipal(),
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setAuthState({
          isAuthenticated: false,
          principal: null,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const signIn = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const principal = await authService.signIn();
      setAuthState({
        isAuthenticated: true,
        principal,
        isLoading: false,
      });
    } catch (error) {
      console.error('Sign in failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setAuthState({
        isAuthenticated: false,
        principal: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const refreshUserInfo = async () => {
    if (!authService.isAuthenticated()) return;
    // This could trigger a re-render if needed
  };

  const getUserInfo = async () => {
    return await authService.getUserInfo();
  };

  const isUserRegistered = async () => {
    return await authService.isUserRegistered();
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      signIn, 
      signOut, 
      refreshUserInfo,
      getUserInfo,
      isUserRegistered
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
