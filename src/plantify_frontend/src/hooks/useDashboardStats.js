import { useState, useEffect } from 'react';
import { backendService } from '../lib/backend';
import { useAuth } from './useAuth';

export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalFundingRaised: 0,
    nftHolders: 0,
    monthlyCommitments: 0,
    activeStartups: 0,
    pendingStartups: 0,
    draftStartups: 0,
    loading: true,
    error: null
  });

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setStats(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        const [
          nftStats,
          allStartups,
          allNFTs,
          allInvestors,
          allCollateralInfo,
          allPurchases
        ] = await Promise.all([
          backendService.getNFTStats(),
          backendService.getAllStartups(),
          backendService.getAllNFTs(),
          backendService.getInvestors(),
          backendService.getAllCollateralInfo(),
          backendService.getAllPurchases()
        ]);

        const activeStartups = allStartups.filter(startup => startup.status === 'approved').length;
        const pendingStartups = allStartups.filter(startup => startup.status === 'pending').length;
        const draftStartups = allStartups.filter(startup => startup.status === 'draft').length;

        const totalFundingRaised = allPurchases.reduce((total, purchase) => {
          const amount = Number(purchase.amount) || 0;
          return total + amount;
        }, 0);

        const monthlyCommitments = allInvestors.reduce((total, investor) => {
          const monthlyBudget = parseFloat(investor.monthlyBudget) || 0;
          return total + monthlyBudget;
        }, 0);

        const nftHolders = new Set(allNFTs.map(nft => nft.owner.owner.toString())).size;

        setStats({
          totalFundingRaised,
          nftHolders,
          monthlyCommitments,
          activeStartups,
          pendingStartups,
          draftStartups,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to fetch dashboard statistics'
        }));
      }
    };

    fetchStats();
  }, [isAuthenticated]);

  return stats;
}
