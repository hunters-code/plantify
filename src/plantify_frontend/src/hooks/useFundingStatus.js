import { useState, useEffect } from 'react';
import { backendService } from '../lib/backend';

export function useFundingStatus(startupId) {
  const [fundingStatus, setFundingStatus] = useState({
    startup: null,
    totalRaised: 0,
    fundingGoal: 0,
    fundingProgress: 0,
    availableFunds: 0,
    platformReserve: 0,
    collateralInfo: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!startupId) {
      setFundingStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchFundingStatus = async () => {
      try {
        setFundingStatus(prev => ({ ...prev, loading: true, error: null }));

        const [startup, purchases, collateralInfo] = await Promise.all([
          backendService.getStartupDetails(startupId),
          backendService.getAllPurchases(),
          backendService.getCollateralStatus(startupId)
        ]);

        if (!startup) {
          throw new Error('Startup not found');
        }

        const startupPurchases = purchases.filter(purchase => 
          purchase.startupId === startupId
        );

        const totalRaised = startupPurchases.reduce((total, purchase) => {
          return total + Number(purchase.amount || 0);
        }, 0);

        const fundingGoal = parseFloat(startup.fundingGoal) || 0;
        const fundingProgress = fundingGoal > 0 ? (totalRaised / fundingGoal) * 100 : 0;

        // Platform typically takes 20% as reserve, startup gets 80%
        const platformReservePercentage = 0.2;
        const availableFunds = totalRaised * (1 - platformReservePercentage);
        const platformReserve = totalRaised * platformReservePercentage;

        setFundingStatus({
          startup,
          totalRaised,
          fundingGoal,
          fundingProgress: Math.min(fundingProgress, 100),
          availableFunds,
          platformReserve,
          collateralInfo: collateralInfo.ok || null,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching funding status:', error);
        setFundingStatus(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to fetch funding status'
        }));
      }
    };

    fetchFundingStatus();
  }, [startupId]);

  return fundingStatus;
}
