import { useState, useEffect } from 'react';

import type {
  Startup,
  StartupSummary,
} from '@/declarations/plantify_backend/plantify_backend.did';
import { StartupService } from '@/services/marketplace/StartupService';

/**
 * Maps a StartupSummary to a Startup with default values for missing fields
 */
const mapStartupSummaryToStartup = (
  summary: StartupSummary | null
): Startup | null => {
  if (!summary) return null;

  return {
    id: summary.id,
    startupName: summary.startupName,
    description: summary.description,
    companyType: summary.companyType,
    companyImages: summary.companyImages,
    nftPrice: summary.nftPrice,
    totalFunded: summary.totalFunded,
    builtByCaffeineAI: summary.builtByCaffeineAI,

    // Default values for required fields not in StartupSummary
    status: 'active',
    periodicProfitSharing: '5',
    foundedYear: '2023',
    competitiveAdvantage: '',
    createdAt: BigInt(0),
    businessPlan: [],
    sector: (summary.companyType.split(' ')[0] || 'Tech').toLocaleUpperCase(),
    useOfFunds: '',
    website: '',
    teamMembers: [],
    targetMarket: '',
    updatedAt: BigInt(0),
    revenueModel: '',
    solution: '',
    companyLogo: [],
    founderId: '',
    financialProjections: [],
    marketingStrategy: '',
    fundingGoal: summary.totalFunding,
    legalDocuments: [],
    monthlyRevenue: '',
    operationalProcess: '',
    nftImage: [],
    advisors: '',
    location: 'Global',
    monthlyExpenses: '',
    problemStatement: '',
    founderBackground: '',
  };
};

export interface FeaturedStartupsData {
  startups: Startup[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch featured startups using pagination (limit 3, page 0)
 */
export function useFeaturedStartupsPaginated(): FeaturedStartupsData {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedStartups = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await StartupService.getStartupsPaginated({
          page: 1,
          limit: 3,
        });

        const mappedStartups = result.startups
          .map(mapStartupSummaryToStartup)
          .filter((startup): startup is Startup => startup !== null);

        setStartups(mappedStartups);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to fetch featured startups';
        setError(errorMessage);
        console.error('Error fetching featured startups:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedStartups();
  }, []);

  return { startups, loading, error };
}
