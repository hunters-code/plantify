import { useState, useEffect } from 'react';
import { backendService } from '../lib/backend';

export function useInvestors(startupId) {
  const [investorData, setInvestorData] = useState({
    investors: [],
    totalInvestment: 0,
    totalInvestors: 0,
    activeInvestors: 0,
    vipInvestors: 0,
    averageParticipation: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!startupId) {
      setInvestorData(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchInvestorData = async () => {
      try {
        setInvestorData(prev => ({ ...prev, loading: true, error: null }));

        const [allInvestors, allPurchases, allNFTs] = await Promise.all([
          backendService.getInvestors(),
          backendService.getAllPurchases(),
          backendService.getAllNFTs()
        ]);

        // Filter purchases for this specific startup
        const startupPurchases = allPurchases.filter(purchase => 
          purchase.startupId === startupId
        );

        // Get unique investors who have purchased NFTs for this startup
        const investorIds = [...new Set(startupPurchases.map(purchase => purchase.investorId))];
        const startupInvestors = allInvestors.filter(investor => 
          investorIds.includes(investor.id)
        );

        // Calculate investor metrics
        const investorsWithMetrics = startupInvestors.map(investor => {
          const investorPurchases = startupPurchases.filter(purchase => 
            purchase.investorId === investor.id
          );
          
          const totalInvestment = investorPurchases.reduce((total, purchase) => {
            return total + Number(purchase.amount || 0);
          }, 0);

          const nftsOwned = allNFTs.filter(nft => 
            nft.startupId === startupId && 
            nft.owner.owner.toString() === investor.principal.toString()
          ).length;

          // Calculate participation based on monthly budget vs actual investment
          const monthlyBudget = parseFloat(investor.monthlyBudget) || 0;
          const participation = monthlyBudget > 0 ? Math.min((totalInvestment / monthlyBudget) * 100, 100) : 0;

          // Determine investor tier based on investment amount
          const badges = [];
          if (totalInvestment >= 10000) {
            badges.push('VIP investors', 'Whale investor', 'Top supporter', 'Community leader');
          } else if (totalInvestment >= 5000) {
            badges.push('VIP investors', 'Early investor', 'Top supporter', 'Community leader');
          } else if (totalInvestment >= 2000) {
            badges.push('Active investors', 'Active voter', 'Long-term holder');
          } else if (totalInvestment >= 1000) {
            badges.push('Active investors', 'Consistent investor');
          } else if (totalInvestment >= 500) {
            badges.push('Active investors', 'New investor');
          } else {
            badges.push('Inactive investors', 'Small investor');
          }

          return {
            ...investor,
            totalInvestment,
            nftsOwned,
            participation: Math.round(participation),
            badges,
            profitReceived: totalInvestment * 0.1, // Mock 10% profit
            location: `${investor.city}, ${investor.country}`
          };
        });

        // Sort investors by investment amount
        investorsWithMetrics.sort((a, b) => b.totalInvestment - a.totalInvestment);

        // Calculate aggregate metrics
        const totalInvestment = investorsWithMetrics.reduce((total, investor) => 
          total + investor.totalInvestment, 0
        );
        const totalInvestors = investorsWithMetrics.length;
        const activeInvestors = investorsWithMetrics.filter(inv => inv.participation >= 70).length;
        const vipInvestors = investorsWithMetrics.filter(inv => inv.totalInvestment >= 5000).length;
        const averageParticipation = totalInvestors > 0 ? 
          Math.round(investorsWithMetrics.reduce((total, inv) => total + inv.participation, 0) / totalInvestors) : 0;

        setInvestorData({
          investors: investorsWithMetrics,
          totalInvestment,
          totalInvestors,
          activeInvestors,
          vipInvestors,
          averageParticipation,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching investor data:', error);
        setInvestorData(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to fetch investor data'
        }));
      }
    };

    fetchInvestorData();
  }, [startupId]);

  return investorData;
}
