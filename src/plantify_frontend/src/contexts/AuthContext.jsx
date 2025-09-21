import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, backendService } from '../lib';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    principal: null,
    isLoading: true,
    userInfo: null,
    isRegistered: false,
    userType: null, // 'founder', 'investor', or null
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Start initialization
        
        // Initialize auth service
        await authService.initialize();
        
        // Get authentication state immediately
        let isAuthenticated = authService.isAuthenticated();
        let principal = authService.getPrincipal();
        
        // Initialize backend service if authenticated
        if (isAuthenticated && authService.getIdentity()) {
          await backendService.initialize(authService.getIdentity());
        }
        
        
        // Update state with initial values (fast path)
        setAuthState(prev => ({
          ...prev,
          isAuthenticated,
          principal,
          // Keep isLoading true until we get user info
        }));
        
        // Get user info if authenticated
        const userInfo = isAuthenticated
          ? await authService.getUserInfo()
          : null;
        
        // Check registration status and user type in the background
        let isRegistered = false;
        let userType = null;
        if (isAuthenticated) {
          try {
            // This can be slow, so we'll update in the background
            Promise.all([
              authService.isUserRegistered(),
              authService.getUserType()
            ]).then(([registered, type]) => {
              setAuthState(prev => ({
                ...prev,
                isRegistered: registered,
                userType: type
              }));
            }).catch(error => {
              console.warn('Could not check user registration status - backend may not be available');
            });
          } catch (error) {
            console.warn('Could not check user registration status - backend may not be available');
          }
        }
        
        // Update state with complete info
        setAuthState(prev => ({
          ...prev,
          isAuthenticated,
          principal,
          isLoading: false,
          userInfo,
          // isRegistered will be updated separately
        }));
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setAuthState({
          isAuthenticated: false,
          principal: null,
          isLoading: false,
          userInfo: null,
          isRegistered: false,
          userType: null,
        });
      }
    };

    initializeAuth();
  }, []);

  const signIn = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const principal = await authService.signIn();
      
      // Initialize backend service with the authenticated identity
      if (authService.getIdentity()) {
        await backendService.initialize(authService.getIdentity());
      }
      
      const userInfo = await authService.getUserInfo();
      
      let isRegistered = false;
      let userType = null;
      try {
        isRegistered = await authService.isUserRegistered();
        userType = await authService.getUserType();
      } catch (error) {
        console.warn('Could not check user registration status - backend may not be available');
        isRegistered = false;
        userType = null;
      }

      setAuthState({
        isAuthenticated: true,
        principal,
        isLoading: false,
        userInfo,
        isRegistered,
        userType,
        userData: userInfo,
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
      // Reset backend service
      backendService.reset();
      setAuthState({
        isAuthenticated: false,
        principal: null,
        isLoading: false,
        userInfo: null,
        isRegistered: false,
        userType: null,
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
      
      let isRegistered = false;
      let userType = null;
      try {
        isRegistered = await authService.isUserRegistered();
        userType = await authService.getUserType();
      } catch (error) {
        console.warn('Could not check user registration status - backend may not be available');
        isRegistered = false;
        userType = null;
      }

      setAuthState(prev => ({
        ...prev,
        userInfo,
        isRegistered,
        userType,
        userData: userInfo,
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
    isBackendDeclarationsAvailable: () =>
      authService.isBackendDeclarationsAvailable(),
    setBackendDeclarations: idlFactory =>
      authService.setBackendDeclarations(idlFactory),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
