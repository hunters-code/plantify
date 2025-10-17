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
    periodicProfitSharing: '5%',
    foundedYear: '2023',
    competitiveAdvantage: '',
    createdAt: BigInt(0),
    businessPlan: [],
    sector: summary.companyType.split(' ')[0] || 'Tech',
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

        const featuredStartupSummary =
          await StartupService.getFeaturedStartup();
        const mappedStartup = mapStartupSummaryToStartup(
          featuredStartupSummary
        );
        setStartup(mappedStartup);
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
