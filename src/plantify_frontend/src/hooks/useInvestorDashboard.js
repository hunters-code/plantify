import { useState, useEffect } from 'react';
import { backendService } from '../lib/backend';
import { useAuth } from './useAuth';

export function useInvestorDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalInvested: 0,
    totalReturns: 0,
    monthlyCommitments: 0,
    activeInvestments: 0,
    votingPending: 0,
    returnPercentage: 0,
    loading: true,
    error: null
  });

  const [matchingStartups, setMatchingStartups] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [investor, setInvestor] = useState(null);

  const { isAuthenticated, principal, getIdentity } = useAuth();

  // Helper function to determine risk level based on sector
  const getRiskLevel = (sector) => {
    const riskMapping = {
      technology: 'High Risk',
      healthtech: 'Moderate Risk',
      fintech: 'High Risk',
      edtech: 'Moderate Risk',
      agriculture: 'Low Risk',
      retail: 'Moderate Risk',
      manufacturing: 'Low Risk',
      services: 'Low Risk',
    };
    return riskMapping[sector?.toLowerCase()] || 'Moderate Risk';
  };

  // Map startup data for display
  const mapStartupData = (startup, allNFTs = []) => {
    const nftPrice = parseFloat(startup.nftPrice) || 100;
    const monthlyProfitSharing = parseFloat(startup.periodicProfitSharing) || 10;
    const fundingGoal = parseFloat(startup.fundingGoal) || 10000;
    
    // Calculate annual returns (monthly * 12)
    const annualReturns = monthlyProfitSharing * 12;
    const annualROI = ((annualReturns / nftPrice) * 100).toFixed(1);
    
    // Calculate available NFTs based on actual NFT data
    const startupNFTs = allNFTs.filter(nft => nft.startupId === startup.id);
    const totalNFTsForStartup = Math.floor(fundingGoal / nftPrice) || 100; // Max NFTs possible
    const soldNFTs = startupNFTs.length;
    const available = Math.max(0, totalNFTsForStartup - soldNFTs);

    // Calculate funding progress
    const fundedAmount = soldNFTs * nftPrice;
    const targetAmount = fundingGoal;
    const fundingProgress = targetAmount > 0 ? Math.min((fundedAmount / targetAmount) * 100, 100) : 0;

    return {
      id: startup.id,
      name: startup.startupName || startup.name || 'Unnamed Startup',
      description: startup.description || 'No description available',
      sector: startup.sector || 'Technology',
      risk: getRiskLevel(startup.sector),
      nftPrice: nftPrice,
      periodicReturns: monthlyProfitSharing,
      annualROI: parseFloat(annualROI),
      available: available,
      fundingProgress: Math.round(fundingProgress),
      fundedAmount: Math.round(fundedAmount),
      targetAmount: Math.round(targetAmount),
      image: startup.companyLogo && startup.companyLogo.length > 0
        ? startup.companyLogo[0]
        : '/assets/images/product.png'
    };
  };

  // Fetch investor data and dashboard stats
  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));

      // Initialize backend service
      const identity = getIdentity();
      if (identity) {
        await backendService.initialize(identity);
      }

      // Get current investor
      const currentInvestor = await backendService.getInvestorByPrincipal();
      setInvestor(currentInvestor);

      if (!currentInvestor) {
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: 'Investor profile not found. Please register as an investor first.'
        }));
        return;
      }

      // Fetch all data in parallel
      const [
        allStartups,
        allNFTs,
        allPurchases,
        nftStats
      ] = await Promise.all([
        backendService.getAllStartups(),
        backendService.getAllNFTs(),
        backendService.getAllPurchases(),
        backendService.getNFTStats()
      ]);

      // Use all startups from getAllStartups() - no filtering by status
      const activeStartups = allStartups;
      
      console.log('Dashboard Startups Debug:', {
        totalStartups: allStartups.length,
        activeStartups: activeStartups.length,
        startupStatuses: allStartups.map(s => ({ id: s.id, name: s.startupName, status: s.status }))
      });

      // Get investor's purchases
      const investorPurchases = allPurchases.filter(purchase => 
        purchase.investorId === currentInvestor.id
      );

      // Calculate investor stats
      const totalInvested = investorPurchases.reduce((total, purchase) => {
        return total + (Number(purchase.amount) || 0);
      }, 0);

      // Get investor's NFTs
      const investorNFTs = allNFTs.filter(nft => 
        nft.owner.owner.toString() === principal?.toString()
      );

      const activeInvestments = investorNFTs.length;

      // Calculate real returns based on actual NFT profit sharing
      let totalReturns = 0;
      let returnPercentage = 0;
      
      // Calculate returns from NFT profit sharing
      investorNFTs.forEach(nft => {
        const startup = allStartups.find(s => s.id === nft.startupId);
        if (startup && startup.periodicProfitSharing) {
          totalReturns += parseFloat(startup.periodicProfitSharing) || 0;
        }
      });
      
      if (totalInvested > 0) {
        returnPercentage = ((totalReturns / (totalInvested / 1000000)) * 100).toFixed(1);
      }
      
      const monthlyCommitments = parseFloat(currentInvestor.monthlyBudget) || 0;
      
      // Count actual voting pending items (placeholder - would need backend support)
      const votingPending = 0; // Real implementation would fetch from backend

      // Get matching startups (limit to 6 for display)
      const matchingStartupsData = activeStartups
        .slice(0, 6)
        .map(startup => mapStartupData(startup, allNFTs));

      // Generate recent activity based on real purchases only
      const recentActivityData = investorPurchases
        .slice(0, 5)
        .map((purchase) => {
          const startup = allStartups.find(s => s.id === purchase.startupId);
          return {
            type: 'investment',
            company: startup?.startupName || 'Unknown Startup',
            amount: Math.round((Number(purchase.amount) / 1000000) * 100) / 100, // Convert from smallest unit
            date: new Date(Number(purchase.timestamp) / 1000000).toLocaleDateString()
          };
        });

      setDashboardData({
        totalInvested: Math.round((totalInvested / 1000000) * 100) / 100, // Convert from smallest unit and round to 2 decimals
        totalReturns: Math.round(totalReturns * 100) / 100, // totalReturns is already in display format
        monthlyCommitments: Math.round(monthlyCommitments * 100) / 100,
        activeInvestments,
        votingPending,
        returnPercentage: parseFloat(returnPercentage),
        loading: false,
        error: null
      });

      setMatchingStartups(matchingStartupsData);
      setRecentActivity(recentActivityData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch dashboard data'
      }));
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setDashboardData(prev => ({ ...prev, loading: false }));
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, principal]);

  return {
    dashboardData,
    matchingStartups,
    recentActivity,
    investor,
    refetch: fetchDashboardData
  };
}
