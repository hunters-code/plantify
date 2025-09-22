import { useState, useEffect } from 'react';
import { backendService } from '../lib/backend';

export function useStartupDetails(startupId) {
  const [startupDetails, setStartupDetails] = useState({
    startup: null,
    fundingProgress: 0,
    nftSales: 0,
    totalNFTs: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!startupId) {
      setStartupDetails(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchStartupDetails = async () => {
      try {
        setStartupDetails(prev => ({ ...prev, loading: true, error: null }));

        const [startup, nfts, purchases] = await Promise.all([
          backendService.getStartupDetails(startupId),
          backendService.getNFTsByStartup(startupId),
          backendService.getAllPurchases()
        ]);

        if (!startup) {
          throw new Error('Startup not found');
        }

        const startupPurchases = purchases.filter(purchase => 
          purchase.startupId === startupId
        );

        const totalFundingRaised = startupPurchases.reduce((total, purchase) => {
          return total + Number(purchase.amount || 0);
        }, 0);

        const fundingGoal = parseFloat(startup.fundingGoal) || 0;
        const fundingProgress = fundingGoal > 0 ? (totalFundingRaised / fundingGoal) * 100 : 0;

        const nftSales = nfts.length;
        const totalNFTs = 100; // Assuming max 100 NFTs per startup

        setStartupDetails({
          startup,
          fundingProgress: Math.min(fundingProgress, 100),
          nftSales,
          totalNFTs,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching startup details:', error);
        setStartupDetails(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to fetch startup details'
        }));
      }
    };

    fetchStartupDetails();
  }, [startupId]);

  return startupDetails;
}
