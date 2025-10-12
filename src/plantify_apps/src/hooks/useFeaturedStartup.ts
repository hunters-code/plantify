import { useState, useEffect } from 'react';

import type { Startup } from '@/declarations/plantify_backend/plantify_backend.did';
import { StartupService } from '@/services/marketplace/StartupService';

export interface FeaturedStartupData {
  startup: Startup | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch the featured startup
 */
export function useFeaturedStartup(): FeaturedStartupData {
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedStartup = async () => {
      try {
        setLoading(true);
        setError(null);

        const featuredStartup = await StartupService.getFeaturedStartup();
        setStartup(featuredStartup);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to fetch featured startup';
        setError(errorMessage);
        console.error('Error fetching featured startup:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedStartup();
  }, []);

  return { startup, loading, error };
}
