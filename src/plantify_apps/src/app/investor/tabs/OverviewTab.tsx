'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Activity,
  Calendar,
  Vote,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { InvestorService } from '@/services/investors/InvestorService';
import { ProductCard } from '@/components/features';
import { Button, Card, LoadingSpinner } from '@/components/ui';

interface DashboardData {
  totalInvested: number;
  totalReturns: number;
  returnPercentage: number;
  monthlyCommitments: number;
  activeInvestments: number;
  votingPending: number;
  recentInvestments: Array<{
    type: 'profit' | 'investment';
    company: string;
    amount: number;
    date: string;
  }>;
  uniqueStartupsInvested: number;
  averageInvestmentPerStartup: number;
  totalNFTsOwned: number;
  error?: string;
}

interface OverviewTabProps {
  dashboardData: DashboardData;
  matchingStartups: Startup[];
  recentActivity: any[];
}

interface Startup {
  id: string | number;
  image: string;
  name: string;
  sector: string;
  risk: string;
  description: string;
  nftPrice: number;
  employees: number;
  periodicReturns: number;
  annualROI: number;
  available: number;
  fundingProgress?: number;
  fundedAmount?: number;
  targetAmount?: number;
}

interface ActivityItem {
  type: 'profit' | 'investment';
  company: string;
  amount: number;
  date: string;
}

export default function OverviewTab({
  dashboardData: propsDashboardData,
  matchingStartups: propsMatchingStartups,
  recentActivity: propsRecentActivity,
}: OverviewTabProps) {
  const navigate = useRouter();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    propsDashboardData || null
  );
  const [matchingStartups, setMatchingStartups] = useState<Startup[]>(
    propsMatchingStartups || []
  );
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>(
    propsRecentActivity || []
  );
  const [error, setError] = useState<string | null>(
    propsDashboardData?.error || null
  );

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await InvestorService.getInvestorDashboardOverview();

      if (!response.success || !response.overview) {
        setError(response.error || 'Error to load data');
        setLoading(false);
        return;
      }

      const data = response.overview;

      setDashboardData({
        totalInvested: Number(data.totalAmountInvested ?? 0),
        totalReturns: Number(data.profitSharingEarnings ?? 0),
        returnPercentage: 0, // Calculate this if needed
        monthlyCommitments: Number(data.monthlyCommitment ?? 0),
        activeInvestments: Number(data.totalInvestments ?? 0),
        votingPending: Number(data.votingPending ?? 0),
        uniqueStartupsInvested: Number(data.uniqueStartupsInvested ?? 0),
        averageInvestmentPerStartup: Number(
          data.averageInvestmentPerStartup ?? 0
        ),
        totalNFTsOwned: Number(data.totalNFTsOwned ?? 0),
        recentInvestments: Array.isArray(data.recentInvestments)
          ? data.recentInvestments.map((item: any) => ({
              type: 'investment',
              company: item.startupName || 'Unknown Company',
              amount: Number(item.amount ?? 0),
              date: new Date(Number(item.date) / 1000000).toLocaleDateString(),
            }))
          : [],
      });

      // Use investment portfolio as matching startups
      setMatchingStartups(
        Array.isArray(data.investmentPortfolio)
          ? data.investmentPortfolio.slice(0, 3).map((s: any) => ({
              id: s.startupId ?? crypto.randomUUID(),
              image: s.startupLogo ?? '/assets/images/icon-startup.png',
              name: s.startupName ?? 'Unnamed Startup',
              sector: s.sector ?? 'General',
              risk: 'Moderate',
              description: 'Investment in your portfolio',
              nftPrice: Number(s.averagePrice ?? 0) / 100,
              employees: 5,
              periodicReturns: Number(s.monthlyCommitment ?? 0) / 100,
              annualROI: 10,
              available: 10,
              fundingProgress: 75,
              fundedAmount: Number(s.totalInvested ?? 0) / 100,
              targetAmount: (Number(s.totalInvested ?? 0) / 100) * 1.5,
            }))
          : []
      );

      setRecentActivity(
        Array.isArray(data.recentInvestments)
          ? data.recentInvestments.map((a: any) => ({
              type: 'investment',
              company: a.startupName || 'Unknown',
              amount: Number(a.amount ?? 0) / 100,
              date: new Date(Number(a.date) / 1000000).toLocaleDateString(),
            }))
          : []
      );

      setLoading(false);
    } catch (err) {
      console.error('Error fetching investor overview:', err);
      setError('Terjadi kesalahan saat memuat data dashboard investor');
      setLoading(false);
    }
  };

  useEffect(() => {
    // If props are provided, use them and skip fetching
    if (propsDashboardData && Object.keys(propsDashboardData).length > 0) {
      setLoading(false);
      return;
    }

    fetchDashboardData();
  }, [propsDashboardData]);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <LoadingSpinner className='mx-auto mb-4' />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className='p-8 text-center flex flex-col justify-center items-center'>
        <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
        <p className='text-gray-600 mb-4'>{error}</p>
        <Button
          variant='primary'
          className='w-fit'
          onClick={fetchDashboardData}
        >
          Try Again
        </Button>
      </Card>
    );
  }

  if (!dashboardData) return null;

  return (
    <>
      {/* === Dashboard Overview === */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        {[
          {
            label: 'Total Invested',
            value: `$${dashboardData.totalInvested.toLocaleString()}`,
            sub: 'ckUSDC',
            color: 'bg-blue-100',
          },
          {
            label: 'Total Returns',
            value: `+$${dashboardData.totalReturns.toLocaleString()}`,
            sub: `${dashboardData.returnPercentage}% overall`,
            color: 'bg-green-100',
          },
          {
            label: 'NFTs Owned',
            value: dashboardData.totalNFTsOwned,
            sub: 'total tokens',
            color: 'bg-purple-100',
          },
          {
            label: 'Startups Invested',
            value: dashboardData.uniqueStartupsInvested,
            sub: 'companies',
            color: 'bg-orange-100',
          },
          {
            label: 'Voting Pending',
            value: dashboardData.votingPending,
            sub: 'action needed',
            color: 'bg-red-100',
          },
        ].map((stat, i) => (
          <div key={i} className='p-6 bg-neutral-100 rounded-[16px]'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 mb-1'>{stat.label}</p>
                <div className='flex items-end gap-2'>
                  <p className='text-2xl pt-2 font-bold text-gray-900'>
                    {stat.value}
                  </p>
                  <p
                    className={`text-sm ${
                      stat.label === 'Total Returns'
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {stat.sub}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* === Matching Startups === */}
      <div className='mb-8'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold text-gray-900'>
            Startups Matching Your Profile
          </h2>
          <Button
            variant='secondary'
            className='text-sm'
            onClick={() => navigate.push('/explore')}
          >
            View all startups
          </Button>
        </div>

        {matchingStartups.length === 0 ? (
          <div className='p-8 text-center bg-neutral-100 rounded-[16px] p-4'>
            <p className='text-gray-600'>No startups available for now.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {matchingStartups.map(startup => (
              <ProductCard
                key={startup.id}
                id={startup.id}
                image={startup.image}
                title={startup.name}
                location='Indonesia'
                employees={startup.employees}
                category={startup.sector}
                risk={startup.risk}
                description={startup.description}
                nftPrice={startup.nftPrice}
                periodicReturns={`$${startup.periodicReturns}`}
                annualROI={startup.annualROI}
                available={startup.available}
                fundingProgress={startup.fundingProgress || 0}
                fundedAmount={startup.fundedAmount || 0}
                targetAmount={
                  startup.targetAmount || startup.nftPrice * startup.available
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* === Recent Activity === */}
      <div className='p-6 bg-neutral-100 rounded-[16px] p-4'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Recent Activity
        </h3>

        {recentActivity.length === 0 ? (
          <div className='text-center py-8'>
            <Activity className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-500'>No recent activity</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className='flex items-center justify-between bg-gray-50 rounded-xl px-4 py-4'
              >
                <div className='flex items-center gap-3'>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'profit'
                        ? 'bg-green-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    {activity.type === 'profit' ? (
                      <TrendingUp className='w-4 h-4 text-green-600' />
                    ) : (
                      <DollarSign className='w-4 h-4 text-blue-600' />
                    )}
                  </div>
                  <div>
                    <p className='font-medium text-gray-900'>
                      {activity.type === 'profit'
                        ? 'Profit sharing'
                        : 'Investment'}
                    </p>
                    <p className='text-sm text-gray-600'>{activity.company}</p>
                  </div>
                </div>

                <div className='text-right'>
                  <p
                    className={`font-medium ${
                      activity.type === 'profit'
                        ? 'text-green-600'
                        : 'text-blue-600'
                    }`}
                  >
                    {activity.type === 'profit' ? '+' : ''}${activity.amount}
                  </p>
                  <p className='text-sm text-gray-500'>{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
