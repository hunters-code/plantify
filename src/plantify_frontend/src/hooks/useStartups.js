import { useState, useEffect } from 'react';
import { backendService } from '../lib';
import { useAuth } from './useAuth';

export const useStartups = () => {
  const { isAuthenticated, isLoading: authLoading, getIdentity } = useAuth();
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStartups = async () => {
    try {
      setLoading(true);
      setError(null);

      // Don't fetch if auth is still loading
      if (authLoading) {
        setLoading(false);
        return;
      }

      // If not authenticated, show empty state
      if (!isAuthenticated) {
        setStartups([]);
        setLoading(false);
        return;
      }

      const identity = getIdentity();
      if (!identity) {
        setError('Authentication required to load startups');
        setLoading(false);
        return;
      }

      // Initialize backend service if not already initialized
      if (!backendService.getActor()) {
        await backendService.initialize(identity);
      }

      const data = await backendService.getAllStartups();
      setStartups(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch startups:', err);
    } finally {
      setLoading(false);
    }
  };

  const createStartup = async startupData => {
    try {
      setLoading(true);
      setError(null);
      const result = await backendService.createStartup(startupData);
      if (result.ok) {
        setStartups(prev => [...prev, result.ok]);
        return result.ok;
      } else {
        throw new Error(result.err);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, [isAuthenticated, authLoading]);

  return {
    startups,
    loading,
    error,
    fetchStartups,
    createStartup,
  };
};
