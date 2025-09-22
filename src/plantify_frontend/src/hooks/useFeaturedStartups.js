import { useState, useEffect } from 'react';
import { backendService } from '../lib/backend';
import { useAuth } from './useAuth';

export function useFeaturedStartups() {
  const { getIdentity, isAuthenticated, authLoading } = useAuth();
  const [featuredStartups, setFeaturedStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapStartupData = (startup) => {
    const fundingGoal = parseFloat(startup.fundingGoal) || 50000;
    const nftPrice = parseFloat(startup.nftPrice) || 100;
    const totalNFTs = Math.floor(fundingGoal / nftPrice);
    const fundedAmount = Math.floor(fundingGoal * 0.6);
    const fundingProgress = Math.floor((fundedAmount / fundingGoal) * 100);
    const monthlyProfitSharing = parseFloat(startup.periodicProfitSharing) || 5;

    return {
      id: startup.id,
      image: startup.companyLogo && startup.companyLogo.length > 0
        ? startup.companyLogo[0]
        : '/assets/images/product.png',
      title: startup.startupName,
      category: startup.sector,
      nftPrice: `$${nftPrice} USD`,
      periodicReturn: `$${monthlyProfitSharing} USD`,
      fundedText: `${fundingProgress}% Funded`,
      fundedPct: fundingProgress / 100,
      fundedColor: fundingProgress > 70 ? '#22c55e' : fundingProgress > 40 ? '#f59e0b' : '#fb923c',
    };
  };

  const fetchFeaturedStartups = async () => {
    try {
      setLoading(true);
      setError(null);

      // Don't fetch if auth is still loading
      if (authLoading) {
        setLoading(false);
        return;
      }

      // If not authenticated, show mock data for demo purposes
      if (!isAuthenticated) {
        const mockStartups = [
          {
            id: 'mock-1',
            image: '/assets/images/product.png',
            title: 'EcoFarm Solutions',
            category: 'Agriculture',
            nftPrice: '$75 USD',
            periodicReturn: '$12 USD',
            fundedText: '45% Funded',
            fundedPct: 0.45,
            fundedColor: '#f59e0b',
          },
          {
            id: 'mock-2',
            image: '/assets/images/product-2.png',
            title: 'SmartCafe Tech',
            category: 'Technology',
            nftPrice: '$100 USD',
            periodicReturn: '$18 USD',
            fundedText: '80% Funded',
            fundedPct: 0.8,
            fundedColor: '#22c55e',
          },
          {
            id: 'mock-3',
            image: '/assets/images/product-3.png',
            title: 'Urban Chicken Farm',
            category: 'Livestock',
            nftPrice: '$50 USD',
            periodicReturn: '$8.5 USD',
            fundedText: '32% Funded',
            fundedPct: 0.32,
            fundedColor: '#fb923c',
          },
        ];
        setFeaturedStartups(mockStartups);
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

      const allStartups = await backendService.getAllStartups();
      
      const featuredStartups = allStartups
        .filter(startup => startup.status === 'active')
        .sort((a, b) => {
          const aProgress = parseFloat(a.fundingGoal) > 0 ? 
            (parseFloat(a.fundingGoal) * 0.6) / parseFloat(a.fundingGoal) : 0;
          const bProgress = parseFloat(b.fundingGoal) > 0 ? 
            (parseFloat(b.fundingGoal) * 0.6) / parseFloat(b.fundingGoal) : 0;
          return bProgress - aProgress;
        })
        .slice(0, 3)
        .map(mapStartupData);

      setFeaturedStartups(featuredStartups);
    } catch (err) {
      console.error('Error fetching featured startups:', err);
      setError('Failed to load featured startups. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedStartups();
  }, [isAuthenticated, authLoading]);

  return {
    featuredStartups,
    loading,
    error,
    refetch: fetchFeaturedStartups,
  };
}
