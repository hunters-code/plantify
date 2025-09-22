import { useState, useEffect } from 'react';
import { backendService } from '../lib/backend';
import { useAuth } from './useAuth';

export function useFounderStartups() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchFounderStartups = async () => {
      try {
        setLoading(true);
        setError(null);

        const founder = await backendService.getFounderByPrincipal();
        if (!founder) {
          setStartups([]);
          setLoading(false);
          return;
        }

        const allStartups = await backendService.getAllStartups();
        const founderStartups = allStartups.filter(startup => 
          startup.founderId === founder.id
        );

        setStartups(founderStartups);
      } catch (error) {
        console.error('Error fetching founder startups:', error);
        setError(error.message || 'Failed to fetch startups');
      } finally {
        setLoading(false);
      }
    };

    fetchFounderStartups();
  }, [isAuthenticated]);

  return { startups, loading, error };
}
