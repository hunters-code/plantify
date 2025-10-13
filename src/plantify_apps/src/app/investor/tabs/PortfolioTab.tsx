'use client';

import { TrendingUp, AlertCircle, Eye, Vote, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Button, Card, LoadingSpinner } from '@/components/ui';
import Badge, { type BadgeVariant } from '@/components/ui/Badge';
import { InvestorService } from '@/services/investors/InvestorService';

interface Investment {
  id: string;
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

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      setError(undefined);

      const result = await InvestorService.getMyInvestmentPortfolio();

      if (!result.success || !result.portfolio) {
        setError(result.error || 'Gagal memuat data portofolio');
        setLoading(false);
        return;
      }

      const transformed = transformPortfolio(result.portfolio);
      setInvestments(transformed);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError('Terjadi kesalahan saat memuat portofolio');
      setLoading(false);
    }
  };

  const transformPortfolio = (portfolio: any): Investment[] => {
    if (!portfolio?.investments || !Array.isArray(portfolio.investments)) {
      return [];
    }

    return portfolio.investments.map((item: any) => {
      const totalInvested = Number(item.totalInvested ?? 0);
      const totalReturns = Number(item.totalReturns ?? 0);
      const nftCount = Number(item.nftCount ?? 0);

      const roi =
        totalInvested > 0
          ? parseFloat(((totalReturns / totalInvested) * 100).toFixed(2))
          : 0;

      const monthlyReturn = Math.floor(totalReturns / 12);
      const fundingGoal = 100000; // asumsi
      const progress = Math.min(Math.floor((totalInvested / fundingGoal) * 100), 100);

      return {
        id: String(item.startupId ?? crypto.randomUUID()),
        startupName: item.startupName || `Startup ${String(item.startupId).slice(0, 8)}...`,
        sector: item.sector || 'Unknown Sector',
        riskLevel: getRiskLevelFromString(item.riskLevel),
        investedAmount: totalInvested,
        nftCount,
        monthlyReturn,
        totalReturns: Math.floor(totalReturns),
        roi,
        progress,
      };
    });
  };

  const getRiskLevelFromString = (riskLevel?: string): string => {
    if (!riskLevel) return 'Moderate Risk';
    const level = riskLevel.toLowerCase();
    if (level.includes('high')) return 'High Risk';
    if (level.includes('low')) return 'Low Risk';
    return 'Moderate Risk';
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <LoadingSpinner className='mx-auto mb-4' />
          <p className='text-gray-600'>Memuat portofolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className='p-8'>
        <div className='text-center'>
          <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Gagal Memuat Portofolio
          </h3>
          <p className='text-gray-600 mb-4'>{error}</p>
          <div className='flex gap-2 justify-center'>
            <Button variant='primary' onClick={fetchPortfolioData}>
              Coba Lagi
            </Button>
            <Button
              variant='secondary'
              onClick={() => navigate.push('/register/investor')}
            >
              Daftar Sebagai Investor
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (investments.length === 0) {
    return (
      <Card className='p-8'>
        <div className='text-center'>
          <TrendingUp className='w-12 h-12 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Belum Ada Investasi
          </h3>
          <p className='text-gray-600 mb-4'>
            Mulailah membangun portofolio Anda dengan berinvestasi di startup.
          </p>
          <div className='flex gap-2 justify-center'>
            <Button variant='primary' onClick={() => navigate.push('/explore')}>
              Jelajahi Startup
            </Button>
            <Button variant='secondary' onClick={fetchPortfolioData}>
              Muat Ulang
            </Button>
          </div>
        </div>
      </Card>
    );
  }

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

  // ===== UI Main =====
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-900'>My Investments</h2>
        <Button variant='secondary' onClick={fetchPortfolioData} className='text-sm'>
          Refresh Portfolio
        </Button>
      </div>

      <div className='space-y-6'>
        {investments.map((investment) => (
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
              <div>
                <p className='text-sm text-gray-600 mb-1'>Invested</p>
                <p className='text-xl font-bold text-gray-900'>
                  ${investment.investedAmount.toLocaleString()}
                </p>
                <p className='text-xs text-gray-500'>
                  ({investment.nftCount} NFTs)
                </p>
              </div>

              <div>
                <p className='text-sm text-gray-600 mb-1'>Monthly return</p>
                <p className='text-xl font-bold text-green-600'>
                  ${investment.monthlyReturn.toLocaleString()}
                </p>
                <p className='text-xs text-gray-500'>per month</p>
              </div>

              <div>
                <p className='text-sm text-gray-600 mb-1'>Total returns</p>
                <p className='text-xl font-bold text-blue-600'>
                  ${investment.totalReturns.toLocaleString()}
                </p>
                <p className='text-xs text-blue-600'>{investment.roi}% ROI</p>
              </div>

              <div>
                <p className='text-sm text-gray-600 mb-1'>Progress</p>
                <div className='flex items-center gap-2'>
                  <p className='text-xl font-bold text-gray-900'>
                    {investment.progress}%
                  </p>
                  <div className='flex-1'>
                    <div className='w-full bg-gray-200 rounded-full h-2'>
                      <div
                        className={`h-2 rounded-full ${getProgressColor(investment.progress)}`}
                        style={{ width: `${investment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
