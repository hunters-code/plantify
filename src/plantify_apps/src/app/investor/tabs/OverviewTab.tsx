'use client';

import React, { useEffect, useState, useCallback } from 'react';

import { useRouter } from 'next/navigation';

import {
  TrendingUp,
  DollarSign,
  Activity,
  AlertCircle,
  Eye,
} from 'lucide-react';

import { ProductCard } from '@/components/features';
import { Button, Card, LoadingSpinner, StatsCard } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import type {
  StartupSummary,
  InvestorRecentInvestment,
} from '@/declarations/plantify_backend/plantify_backend.did';
import { InvestorService } from '@/services/investors/InvestorService';
import { StartupService } from '@/services/marketplace/StartupService';
import { getRiskLevel } from '@/utils/riskLevels';

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

interface RecentActivity {
  type: 'profit' | 'investment';
  company: string;
  amount: number;
  date: string;
  logo?: string;
}

interface OverviewTabProps {
  dashboardData: DashboardData;
  matchingStartups: Startup[];
  recentActivity: RecentActivity[];
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

export default function OverviewTab({
  dashboardData: propsDashboardData,
  matchingStartups: propsMatchingStartups,
  recentActivity: propsRecentActivity,
}: OverviewTabProps) {
  const navigate = useRouter();
  const { userType, isLoading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    propsDashboardData || null
  );
  const [matchingStartups, setMatchingStartups] = useState<Startup[]>(
    propsMatchingStartups || []
  );
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>(
    propsRecentActivity || []
  );
  const [error, setError] = useState<string | null>(
    propsDashboardData?.error || null
  );

  const mapStartupData = (startup: StartupSummary): Startup => {
    const fundingGoal = parseFloat(startup.totalFunding) || 50000;
    const nftPrice = parseFloat(startup.nftPrice) || 100;
    const totalNFTs = Math.floor(fundingGoal / nftPrice);
    const fundedAmount = Number(startup.totalFunded) || 0;
    const fundingProgress =
      fundingGoal > 0
        ? Math.min(Math.floor((fundedAmount / fundingGoal) * 100), 100)
        : 0;
    const available =
      Number(startup.availableNFTs) || Math.floor(totalNFTs * 0.4);

    // Default values since StartupSummary doesn't have these fields
    const monthlyProfitSharing = 5;
    const annualReturns = monthlyProfitSharing * 12;
    const annualROI = (annualReturns / nftPrice) * 100;

    return {
      id: startup.id,
      image: startup.companyImages?.[0] || '/assets/images/icon-startup.png',
      name: startup.startupName,
      sector: startup.companyType || 'Technology',
      risk: getRiskLevel(startup.companyType || 'Technology'),
      description: startup.description,
      nftPrice,
      employees: 5,
      periodicReturns: monthlyProfitSharing,
      annualROI: parseFloat(annualROI.toFixed(1)),
      available,
      fundingProgress,
      fundedAmount,
      targetAmount: fundingGoal,
    };
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Wait for auth to finish loading
      if (authLoading) {
        return;
      }

      // Check if user is registered as investor using AuthContext
      if (userType !== 'investor') {
        setError('You are not registered as an investor.');
        setLoading(false);
        setDataReady(true);
        return;
      }

      // Always fetch fresh dashboard data from API
      const dashboardPromise = InvestorService.getInvestorDashboardOverview();

      // Always fetch startup data
      const [response, startupsResponse] = await Promise.all([
        dashboardPromise,
        StartupService.getStartupsPaginated({ page: 1, limit: 6 }),
      ]);

      // Handle dashboard data
      if (response.success && response.overview) {
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
            ? data.recentInvestments.map((item: InvestorRecentInvestment) => ({
                type: 'investment' as const,
                company: item.startupName || 'Unknown Company',
                amount: Number(item.amount ?? 0),
                date: new Date(
                  Number(item.date) / 1000000
                ).toLocaleDateString(),
              }))
            : [],
        });

        setRecentActivity(
          Array.isArray(data.recentInvestments)
            ? data.recentInvestments.map((a: InvestorRecentInvestment) => ({
                type: 'investment' as const,
                company: a.startupName || 'Unknown',
                amount: Number(a.amount ?? 0),
                date: new Date(Number(a.date) / 1000000).toLocaleDateString(),
                logo: '/assets/images/icon-startup.png',
              }))
            : []
        );
      } else {
        // Set default dashboard data if investor service fails
        setDashboardData({
          totalInvested: 0,
          totalReturns: 0,
          returnPercentage: 0,
          monthlyCommitments: 0,
          activeInvestments: 0,
          votingPending: 0,
          uniqueStartupsInvested: 0,
          averageInvestmentPerStartup: 0,
          totalNFTsOwned: 0,
          recentInvestments: [],
        });
        setRecentActivity([]);
      }

      // Handle startup data (independent of dashboard data)
      if (startupsResponse.startups.length > 0) {
        const mappedStartups = startupsResponse.startups
          .slice(0, 6) // Show up to 6 startups like explore page
          .map(mapStartupData);
        setMatchingStartups(mappedStartups);
      } else {
        setMatchingStartups([]);
      }

      setLoading(false);
      setDataReady(true);
    } catch (err) {
      console.error('Error fetching investor overview:', err);
      setError('Terjadi kesalahan saat memuat data dashboard investor');
      setLoading(false);
      setDataReady(true);
    }
  }, [authLoading, userType]);

  useEffect(() => {
    // Only fetch when auth is ready and user is authenticated
    if (!authLoading && userType) {
      fetchDashboardData();
    }
  }, [authLoading, userType, fetchDashboardData]);

  if (loading || !dataReady) {
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
  console.log('dashboardData', dashboardData);
  return (
    <>
      {/* Dashboard Overview Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
        <StatsCard
          label='Total Invested'
          value={`$${dashboardData.totalInvested.toFixed(2)}`}
          subtitle='ckUSDC'
        />

        <StatsCard
          label='Total Returns'
          value={`+$${dashboardData.totalReturns.toFixed(2)}`}
          subtitle={`${dashboardData.returnPercentage}% overall`}
        />

        <StatsCard
          label='Monthly Commitments'
          value={`$${dashboardData.monthlyCommitments.toFixed(2)}`}
          subtitle='ckUSDC/month'
        />

        <StatsCard
          label='Active Investments'
          value={dashboardData.activeInvestments}
          subtitle={`of ${dashboardData.uniqueStartupsInvested} total`}
        />

        <StatsCard
          label='Voting Pending'
          value={dashboardData.votingPending}
          subtitle='action needed'
        />
      </div>

      {/* === Matching Startups === */}
      <div className='mb-8'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold text-gray-900'>
            Startups Matching Your Profile
          </h2>
          <button
            className='flex items-center justify-center gap-[6px] px-4 py-2 text-sm font-medium transition rounded-[12px] border border-gray-200 bg-gray-100 shadow-[0_3px_3px_rgba(255,255,255,0.40)_inset,0_-2px_1px_rgba(0,0,0,0.25)_inset,0_2px_4px_rgba(0,0,0,0.16)] text-gray-900'
            onClick={() => navigate.push('/explore')}
          >
            <Eye size={16} />
            View all startups
          </button>
        </div>

        {matchingStartups.length === 0 ? (
          <Card className='p-8'>
            <div className='text-center'>
              <Activity className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No Startups Available
              </h3>
              <p className='text-gray-600 mb-4'>
                There are currently no active startups available for investment.
              </p>
              <Button
                variant='primary'
                onClick={() => navigate.push('/explore')}
              >
                Explore All Startups
              </Button>
            </div>
          </Card>
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
      <div className='p-6 rounded-[16px] p-4'>
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
            {recentActivity.map((activity, index) => {
              console.log('activity', activity);
              return (
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
                      <p className='font-medium text-lg text-gray-900'>
                        {activity.type === 'profit'
                          ? 'Profit sharing'
                          : 'Investment'}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {activity.company}
                      </p>
                    </div>
                  </div>

                  <div className='text-right'>
                    <p
                      className={`font-medium text-lg ${
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
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
