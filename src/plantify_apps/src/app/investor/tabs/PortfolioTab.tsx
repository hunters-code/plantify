import { TrendingUp, AlertCircle, Eye, Vote, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Button, Card, LoadingSpinner } from '@/components/ui';
import Badge, { type BadgeVariant } from '@/components/ui/Badge';
import { InvestorService } from '@/services/investors/InvestorService';
// import { StartupService } from '@/services/startups/StartupService'; // Uncomment if you have this
import type { NFTPurchaseHistory, NFTPurchaseInfo } from '@/declarations/plantify_backend/plantify_backend.did';

// Types
interface Investment {
  id: string | number;
  startupName: string;
  sector: string;
  riskLevel: 'High Risk' | 'Moderate Risk' | 'Low Risk' | string;
  investedAmount: number;
  nftCount: number;
  monthlyReturn: number;
  totalReturns: number;
  roi: number;
  progress: number;
}

interface PortfolioTabProps {
  onViewDetails: (investment: Investment) => void;
  onVoteReport: (investment: Investment) => void;
  onAddInvestment: (investment: Investment) => void;
}

export default function PortfolioTab({
  onViewDetails,
  onVoteReport,
  onAddInvestment,
}: PortfolioTabProps) {
  const navigate = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [investorId, setInvestorId] = useState<string | null>(null);

  // Fetch investor data and purchase history
  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      setError(undefined);

      // Get current investor
      const investor = await InvestorService.getInvestorByPrincipal();
      
      if (!investor) {
        setError('Investor not found. Please register as an investor.');
        setLoading(false);
        return;
      }

      setInvestorId(investor.id);

      // Get purchase history
      const result = await InvestorService.getInvestorPurchaseHistory(
        investor.id
      );

      if (!result.success || !result.history) {
        setError(result.error || 'Failed to load portfolio data');
        setLoading(false);
        return;
      }

      // Transform purchase history to investments
      const transformedInvestments = await transformPurchaseHistory(result.history);
      setInvestments(transformedInvestments);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  // Transform NFTPurchaseHistory to Investment array
  const transformPurchaseHistory = async (
    history: NFTPurchaseHistory
  ): Promise<Investment[]> => {
    // Group purchases by startup
    const startupMap = new Map<string, {
      id: string;
      investedAmount: number;
      nftCount: number;
      purchases: NFTPurchaseInfo[];
    }>();

    history.purchases.forEach(purchase => {
      const startupId = purchase.startupId;
      
      if (!startupMap.has(startupId)) {
        startupMap.set(startupId, {
          id: startupId,
          investedAmount: 0,
          nftCount: 0,
          purchases: [],
        });
      }

      const startup = startupMap.get(startupId)!;
      startup.purchases.push(purchase);
      startup.investedAmount += Number(purchase.amount);
      startup.nftCount += 1;
    });

    // Fetch startup details for each startup ID
    const investments = await Promise.all(
      Array.from(startupMap.values()).map(async (startup) => {
        // TODO: Fetch startup details using StartupService
        // const startupDetails = await StartupService.getStartupById(startup.id);
        
        // Calculate based on your business logic
        const monthlyReturnRate = 0.05; // 5% monthly return (example)
        const monthlyReturn = startup.investedAmount * monthlyReturnRate;
        
        // Calculate total returns based on time elapsed (example)
        const totalReturns = startup.investedAmount * 0.15; // 15% total return (example)
        const roi = startup.investedAmount > 0 
          ? ((totalReturns / startup.investedAmount) * 100).toFixed(2)
          : '0';
        
        // Calculate progress based on funding goal (example)
        const progress = Math.min(
          Math.floor((startup.investedAmount / 100000) * 100),
          100
        );

        return {
          id: startup.id,
          startupName: `Startup ${startup.id.slice(0, 8)}...`, // Replace with: startupDetails?.name || 'Unknown Startup'
          sector: 'Technology', // Replace with: startupDetails?.sector || 'Unknown Sector'
          riskLevel: 'Moderate Risk' as const, // Replace with: startupDetails?.riskLevel || 'Moderate Risk'
          investedAmount: startup.investedAmount,
          nftCount: startup.nftCount,
          monthlyReturn: Math.floor(monthlyReturn),
          totalReturns: Math.floor(totalReturns),
          roi: parseFloat(roi),
          progress: progress,
        };
      })
    );

    return investments;
  };

  // Load portfolio on mount
  useEffect(() => {
    fetchPortfolioData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <LoadingSpinner className='mx-auto mb-4' />
          <p className='text-gray-600'>Loading portfolio...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className='p-8'>
        <div className='text-center'>
          <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Error Loading Portfolio
          </h3>
          <p className='text-gray-600 mb-4'>{error}</p>
          <div className='flex gap-2 justify-center'>
            <Button variant='primary' onClick={fetchPortfolioData}>
              Try Again
            </Button>
            <Button
              variant='secondary'
              onClick={() => navigate.push('/register/investor')}
            >
              Register as Investor
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Empty state
  if (investments.length === 0) {
    return (
      <Card className='p-8'>
        <div className='text-center'>
          <TrendingUp className='w-12 h-12 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No Investments Yet
          </h3>
          <p className='text-gray-600 mb-4'>
            Start building your portfolio by investing in startups
          </p>
          <div className='flex gap-2 justify-center'>
            <Button variant='primary' onClick={() => navigate.push('/explore')}>
              Explore Startups
            </Button>
            <Button variant='secondary' onClick={fetchPortfolioData}>
              Refresh Portfolio
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Helper functions
  const getProgressColor = (progress: number): string => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 75) return 'bg-green-400';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getRiskVariant = (risk: string): BadgeVariant => {
    switch (risk) {
      case 'High Risk':
        return 'destructive';
      case 'Moderate Risk':
        return 'warning';
      case 'Low Risk':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-900'>My Investments</h2>
        <Button
          variant='secondary'
          onClick={fetchPortfolioData}
          className='text-sm'
        >
          Refresh Portfolio
        </Button>
      </div>

      {/* Investment Cards */}
      <div className='space-y-6'>
        {investments.map(investment => (
          <Card key={investment.id} className='p-6'>
            <div className='flex items-start justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                  <div className='w-4 h-4 bg-green-500 rounded-full'></div>
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    {investment.startupName}
                  </h3>
                  <div className='flex items-center gap-2 mt-1'>
                    <Badge variant='outline' className='text-xs'>
                      {investment.sector}
                    </Badge>
                    <Badge
                      variant={getRiskVariant(investment.riskLevel)}
                      className='text-xs'
                    >
                      {investment.riskLevel}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-4 gap-6 mb-6'>
              {/* Invested */}
              <div>
                <p className='text-sm text-gray-600 mb-1'>Invested</p>
                <p className='text-xl font-bold text-gray-900'>
                  ${investment.investedAmount.toLocaleString()}
                </p>
                <p className='text-xs text-gray-500'>
                  ({investment.nftCount} NFTs)
                </p>
              </div>

              {/* Monthly Return */}
              <div>
                <p className='text-sm text-gray-600 mb-1'>Monthly return</p>
                <p className='text-xl font-bold text-green-600'>
                  ${investment.monthlyReturn.toLocaleString()}
                </p>
                <p className='text-xs text-gray-500'>per month</p>
              </div>

              {/* Total Returns */}
              <div>
                <p className='text-sm text-gray-600 mb-1'>Total returns</p>
                <p className='text-xl font-bold text-blue-600'>
                  ${investment.totalReturns.toLocaleString()}
                </p>
                <p className='text-xs text-blue-600'>{investment.roi}% ROI</p>
              </div>

              {/* Progress */}
              <div>
                <p className='text-sm text-gray-600 mb-1'>Progress</p>
                <div className='flex items-center gap-2'>
                  <p className='text-xl font-bold text-gray-900'>
                    {investment.progress}%
                  </p>
                  <div className='flex-1'>
                    <div className='w-full bg-gray-200 rounded-full h-2'>
                      <div
                        className={`h-2 rounded-full ${getProgressColor(
                          investment.progress
                        )}`}
                        style={{ width: `${investment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-3'>
              <Button
                variant='secondary'
                className='flex items-center gap-2'
                onClick={() => onViewDetails(investment)}
              >
                <Eye className='w-4 h-4' />
                View details
              </Button>
              <Button
                variant='secondary'
                className='flex items-center gap-2'
                onClick={() => onVoteReport(investment)}
              >
                <Vote className='w-4 h-4' />
                Vote on report
              </Button>
              <Button
                variant='primary'
                className='flex items-center gap-2'
                onClick={() => onAddInvestment(investment)}
              >
                <Plus className='w-4 h-4' />
                Add investment
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}