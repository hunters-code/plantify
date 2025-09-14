import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../lib/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    principal: null,
    isLoading: true,
    userInfo: null,
    isRegistered: false,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await authService.initialize();
        const isAuthenticated = authService.isAuthenticated();
        const principal = authService.getPrincipal();
        const userInfo = isAuthenticated ? await authService.getUserInfo() : null;
        const isRegistered = isAuthenticated ? await authService.isUserRegistered() : false;

        setAuthState({
          isAuthenticated,
          principal,
          isLoading: false,
          userInfo,
          isRegistered,
        });
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setAuthState({
          isAuthenticated: false,
          principal: null,
          isLoading: false,
          userInfo: null,
          isRegistered: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const signIn = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const principal = await authService.signIn();
      const userInfo = await authService.getUserInfo();
      const isRegistered = await authService.isUserRegistered();

      setAuthState({
        isAuthenticated: true,
        principal,
        isLoading: false,
        userInfo,
        isRegistered,
      });

      return principal;
    } catch (error) {
      console.error('Sign in failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setAuthState({
        isAuthenticated: false,
        principal: null,
        isLoading: false,
        userInfo: null,
        isRegistered: false,
      });
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  const refreshUserInfo = async () => {
    if (!authService.isAuthenticated()) return;

    try {
      const userInfo = await authService.getUserInfo();
      const isRegistered = await authService.isUserRegistered();
      
      setAuthState(prev => ({
        ...prev,
        userInfo,
        isRegistered,
      }));
    } catch (error) {
      console.error('Failed to refresh user info:', error);
    }
  };

  const value = {
    ...authState,
    signIn,
    signOut,
    refreshUserInfo,
    getActor: () => authService.getActor(),
    getAgent: () => authService.getAgent(),
    initializeBackendActor: () => authService.initializeBackendActor(),
  };

  return (
    <AuthContext.Provider value={value}>
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
