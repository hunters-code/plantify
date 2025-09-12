import { useState, useEffect } from 'react';
import { authService } from '../lib';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      await authService.initialize();
      const isAuth = authService.isAuthenticated();
      const userPrincipal = authService.getPrincipal();
      
      setIsAuthenticated(isAuth);
      setPrincipal(userPrincipal);
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async () => {
    try {
      setIsLoading(true);
      const userPrincipal = await authService.signIn();
      setPrincipal(userPrincipal);
      setIsAuthenticated(true);
      return userPrincipal;
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setPrincipal(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  return {
    isAuthenticated,
    principal,
    isLoading,
    signIn,
    signOut
  };
};
