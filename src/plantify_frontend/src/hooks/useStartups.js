import { useState, useEffect } from 'react';
import { backendService } from '../lib';

export const useStartups = () => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStartups = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await backendService.getAllStartups();
      setStartups(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch startups:', err);
    } finally {
      setLoading(false);
    }
  };

  const createStartup = async (startupData) => {
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
  }, []);

  return {
    startups,
    loading,
    error,
    fetchStartups,
    createStartup
  };
};
