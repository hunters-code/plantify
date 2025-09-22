import { useState, useEffect } from 'react';
import { backendService } from '../lib/backend';
import { useAuth } from './useAuth';

export function useInvestorPortfolio() {
  const [portfolioData, setPortfolioData] = useState({
    investments: [],
    totalInvested: 0,
    totalReturns: 0,
    totalROI: 0,
    loading: true,
    error: null
  });

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

  // Calculate progress percentage
  const calculateProgress = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  // Map investment data for display
  const mapInvestmentData = (purchase, startup, nfts) => {
    try {
      const nftPrice = parseFloat(startup.nftPrice) || 100;
      const monthlyProfitSharing = parseFloat(startup.periodicProfitSharing) || 10;
      const investedAmount = Number(purchase.amount) || 0;
      const nftCount = Math.max(1, Math.floor(investedAmount / (nftPrice * 1000000))); // Ensure at least 1 NFT
      
      // Calculate returns (mock calculation)
      const monthlyReturn = monthlyProfitSharing * nftCount;
      const totalReturns = monthlyReturn * 12; // Annual returns
      const roi = investedAmount > 0 ? ((totalReturns / (investedAmount / 1000000)) * 100) : 0;
      
      // Calculate progress (mock - based on time since investment)
      let investmentDate;
      try {
        // Handle different timestamp formats
        const timestamp = Number(purchase.timestamp);
        investmentDate = timestamp > 1000000000000 
          ? new Date(timestamp / 1000000) // Nanoseconds to milliseconds
          : new Date(timestamp); // Already in milliseconds
      } catch {
        investmentDate = new Date(); // Fallback to current date
      }
      
      const monthsSinceInvestment = Math.floor((Date.now() - investmentDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
      const progressPercentage = Math.min(Math.max(0, (monthsSinceInvestment / 36) * 100), 100); // 36 months investment period

      return {
        id: purchase.id || `purchase-${Date.now()}`,
        startupId: startup.id,
        startupName: startup.startupName || startup.name || 'Unknown Startup',
        sector: startup.sector || 'Technology',
        riskLevel: getRiskLevel(startup.sector),
        investedAmount: Math.round((investedAmount / 1000000) * 100) / 100, // Convert from smallest unit and round
        nftCount: nftCount,
        monthlyReturn: Math.round(monthlyReturn * 100) / 100,
        totalReturns: Math.round(totalReturns * 100) / 100,
        roi: roi.toFixed(1),
        progress: Math.round(progressPercentage),
        investmentDate: investmentDate.toLocaleDateString(),
        image: (startup.companyLogo && startup.companyLogo.length > 0)
          ? startup.companyLogo[0]
          : '/assets/images/product.png'
      };
    } catch (error) {
      console.error('Error mapping investment data:', error, { purchase, startup });
      // Return null to filter out invalid data
      return null;
    }
  };

  // Fetch portfolio data
  const fetchPortfolioData = async () => {
    try {
      setPortfolioData(prev => ({ ...prev, loading: true, error: null }));

      // Initialize backend service
      const identity = getIdentity();
      if (identity) {
        await backendService.initialize(identity);
      }

      // Get current investor
      const currentInvestor = await backendService.getInvestorByPrincipal();
      
      if (!currentInvestor) {
        setPortfolioData(prev => ({
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
        allPurchases
      ] = await Promise.all([
        backendService.getAllStartups(),
        backendService.getAllNFTs(),
        backendService.getAllPurchases()
      ]);

      console.log('Portfolio Data Debug:', {
        startupsCount: allStartups.length,
        nftsCount: allNFTs.length,
        purchasesCount: allPurchases.length,
        currentInvestor: currentInvestor.id
      });

      // Get investor's purchases
      const investorPurchases = allPurchases.filter(purchase => 
        purchase.investorId === currentInvestor.id
      );

      // Get investor's NFTs
      const investorNFTs = allNFTs.filter(nft => 
        nft.owner && nft.owner.owner && nft.owner.owner.toString() === principal?.toString()
      );

      console.log('Investor Portfolio Debug:', {
        investorPurchasesCount: investorPurchases.length,
        investorNFTsCount: investorNFTs.length,
        investorPurchases: investorPurchases.map(p => ({
          id: p.id,
          startupId: p.startupId,
          amount: p.amount,
          timestamp: p.timestamp
        }))
      });

      // Map investment data
      let investments = investorPurchases.map(purchase => {
        try {
          const startup = allStartups.find(s => s.id === purchase.startupId);
          const startupNFTs = investorNFTs.filter(nft => nft.startupId === purchase.startupId);
          
          if (!startup) {
            console.warn(`Startup not found for purchase ${purchase.id}, startupId: ${purchase.startupId}`);
            return null;
          }
          
          return mapInvestmentData(purchase, startup, startupNFTs);
        } catch (error) {
          console.error('Error processing investment:', error, purchase);
          return null;
        }
      }).filter(Boolean); // Remove null entries

      console.log('Mapped investments:', investments.length);


      // Calculate totals
      const totalInvested = investments.reduce((total, inv) => total + inv.investedAmount, 0);
      const totalReturns = investments.reduce((total, inv) => total + inv.totalReturns, 0);
      const totalROI = totalInvested > 0 ? ((totalReturns / totalInvested) * 100) : 0;

      setPortfolioData({
        investments,
        totalInvested,
        totalReturns,
        totalROI: totalROI.toFixed(1),
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      setPortfolioData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch portfolio data'
      }));
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setPortfolioData(prev => ({ ...prev, loading: false }));
      return;
    }

    fetchPortfolioData();
  }, [isAuthenticated, principal]);

  return {
    portfolioData,
    refetch: fetchPortfolioData
  };
}
