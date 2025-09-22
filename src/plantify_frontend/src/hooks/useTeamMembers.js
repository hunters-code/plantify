import { useState, useEffect } from 'react';
import { backendService } from '../lib/backend';

export function useTeamMembers(startupId) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!startupId) {
      setTeamMembers([]);
      setLoading(false);
      return;
    }

    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        setError(null);

        const startup = await backendService.getStartupDetails(startupId);
        
        if (!startup) {
          throw new Error('Startup not found');
        }

        const members = startup.teamMembers || [];
        setTeamMembers(members);
      } catch (error) {
        console.error('Error fetching team members:', error);
        setError(error.message || 'Failed to fetch team members');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [startupId]);

  return { teamMembers, loading, error };
}
