'use client';

import React, { useState, useEffect, Suspense } from 'react';

import { useSearchParams } from 'next/navigation';

import { Eye, Vote, CreditCard, TrendingUp, LucideIcon } from 'lucide-react';

import { Layout } from '@/components';
import { useAuth } from '@/contexts/AuthContext';
import { InvestorService } from '@/services/investors/InvestorService';

import { OverviewTab, PortfolioTab, VotingTab, TransactionsTab } from './tabs';

interface Investment {
  id: string;
  startupName: string;
  sector: string;
  riskLevel: string;
  investedAmount: number;
  nftCount: number;
  monthlyReturn: number;
  totalReturns: number;
  roi: number;
  progress: number;
  startupLogo?: string;
}

interface ActivityItem {
  type: 'profit' | 'investment';
  company: string;
  amount: number;
  date: string;
}

interface DashboardData {
  totalInvested: number;
  totalReturns: number;
  returnPercentage: number;
  monthlyCommitments: number;
  activeInvestments: number;
  upcomingVotes: number;
  votingPending: number;
  recentInvestments: ActivityItem[];
  uniqueStartupsInvested: number;
  averageInvestmentPerStartup: number;
  totalNFTsOwned: number;
}

type TabType = 'overview' | 'portfolio' | 'voting' | 'transactions';

interface TabConfig {
  id: TabType;
  label: string;
  icon: LucideIcon;
}

function InvestorDashboardContent() {
  const {
    userType,
    isLoading: authLoading,
    isAuthenticated,
    isRegistered,
  } = useAuth();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab') as TabType;
  const [activeTab, setActiveTab] = useState<TabType>(tabParam || 'overview');
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalInvested: 0,
    totalReturns: 0,
    returnPercentage: 0,
    monthlyCommitments: 0,
    activeInvestments: 0,
    upcomingVotes: 0,
    votingPending: 0,
    recentInvestments: [],
    uniqueStartupsInvested: 0,
    averageInvestmentPerStartup: 0,
    totalNFTsOwned: 0,
  });

  const [error, setError] = useState<string | null>(null);

  // Portfolio state
  const [portfolioData, setPortfolioData] = useState<{
    loading: boolean;
    investments: Investment[];
    error?: string;
  }>({
    loading: true,
    investments: [],
  });

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (
      tabParam &&
      ['overview', 'portfolio', 'voting', 'transactions'].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPortfolioData(prev => ({ ...prev, loading: true }));

        // Check if user is registered as investor using AuthContext

        // Wait for auth to finish loading before checking userType
        if (authLoading) {
          return;
        }

        // Also wait if user is authenticated but registration status is still being determined
        if (isAuthenticated && !isRegistered && userType === null) {
          return;
        }

        // Check if user is authenticated and registered
        if (!isAuthenticated) {
          setError('Please sign in to access investor dashboard.');
          return;
        }

        if (!isRegistered) {
          setError('You are not registered. Please register first.');
          return;
        }

        if (userType !== 'investor') {
          setError('You are not registered as an investor.');
          return;
        }

        // Try to fetch investor profile
        const investorData = await InvestorService.getInvestorByPrincipal();

        // If no investor data but user is marked as investor, continue with default data
        if (!investorData) {
          // Don't return error, continue with portfolio fetch
        }

        // Fetch portfolio data using getMyInvestmentPortfolio
        const portfolioResult =
          await InvestorService.getMyInvestmentPortfolio();

        if (portfolioResult.success && portfolioResult.portfolio) {
          // Map portfolio items to investments for PortfolioTab
          const mappedInvestments =
            portfolioResult.portfolio.portfolioItems.map(item => {
              // Calculate monthly return as a percentage of current value
              const monthlyReturn = Number(item.monthlyCommitment) / 100;

              // Calculate total returns from profit sharing earnings
              const totalReturns = Number(item.profitSharingEarnings) / 100;

              // Calculate ROI as percentage of return amount to current value
              const roi = Number(item.returnPercentage);

              // Calculate invested amount from current value
              const investedAmount = Number(item.currentValue) / 100;

              return {
                id: item.startupId,
                startupName: item.startupName,
                sector: item.sector || 'Unknown',
                riskLevel: 'Moderate Risk', // Default risk level
                investedAmount,
                nftCount: Number(item.nftCount),
                monthlyReturn,
                totalReturns,
                roi,
                progress: 100, // Default progress value
                startupLogo: item.startupLogo?.[0] || undefined,
              };
            });

          setPortfolioData({
            loading: false,
            investments: mappedInvestments,
          });

          // Use portfolio data for dashboard stats
          const totalInvested =
            Number(portfolioResult.portfolio.totalInvested) / 100;
          const totalReturns =
            Number(portfolioResult.portfolio.totalReturns) / 100;
          const returnPercentage = Number(
            portfolioResult.portfolio.returnPercentage
          );

          setDashboardData(prev => ({
            ...prev,
            totalInvested,
            totalReturns,
            returnPercentage,
            monthlyCommitments: mappedInvestments.reduce(
              (sum, inv) => sum + inv.monthlyReturn,
              0
            ),
            activeInvestments: mappedInvestments.length,
            upcomingVotes: 2, // Default value
            votingPending: 1, // Default value
          }));
        } else {
          setPortfolioData({
            loading: false,
            investments: [],
            error: portfolioResult.error || 'Failed to load portfolio data',
          });

          setDashboardData(prev => ({
            ...prev,
            totalInvested: 0,
            totalReturns: 0,
            returnPercentage: 0,
            monthlyCommitments: 0,
            activeInvestments: 0,
            upcomingVotes: 0,
            votingPending: 0,
          }));
        }
      } catch (err) {
        console.error(err);
        setError('Gagal memuat data investor');
        setPortfolioData({
          loading: false,
          investments: [],
          error: 'Failed to load portfolio data',
        });
      } finally {
      }
    };

    fetchData();
  }, [userType, authLoading, isAuthenticated, isRegistered]);

  const refetch = () => {
    window.location.reload();
  };

  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'portfolio', label: 'My Portfolio', icon: TrendingUp },
    { id: 'voting', label: 'Voting', icon: Vote },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
  ];

  return (
    <Layout>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          {/* <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                Investor Dashboard
              </h1>
              {investor && (
                <p className='text-gray-600'>
                  Welcome back, {investor.fullName || 'Investor'}
                </p>
              )}
            </div>
            <Button
              variant='secondary'
              onClick={refetch}
              className='flex items-center gap-2'
            >
              <ArrowUpRight size={16} />
              Refresh
            </Button>
          </div> */}

          {/* Tabs */}
          <div className='flex gap-2 mb-6 border border-neutral-200 rounded-full w-fit mt-4'>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-[6px] px-4 py-2 text-sm font-medium transition rounded-[12px] ${
                    activeTab === tab.id
                      ? 'border border-gray-200 bg-gray-100 shadow-[0_3px_3px_rgba(255,255,255,0.40)_inset,0_-2px_1px_rgba(0,0,0,0.25)_inset,0_2px_4px_rgba(0,0,0,0.16)] text-gray-900'
                      : 'text-gray-600 hover:bg-white'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
            <p className='text-red-800 text-sm'>{error}</p>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              Dashboard Investor
            </h1>
            <OverviewTab
              dashboardData={dashboardData}
              matchingStartups={[]}
              recentActivity={[]}
            />
          </>
        )}

        {activeTab === 'portfolio' && (
          <PortfolioTab
            portfolioData={portfolioData}
            onViewDetails={investment => {
              // Navigate to detail page
              window.location.href = `/explore/detail?id=${investment.id}`;
            }}
            onVoteReport={investment => {
              // Navigate to voting page
              window.location.href = `/investor/voting?startupId=${investment.id}`;
            }}
            onAddInvestment={investment => {
              // Navigate to investment page
              window.location.href = `/explore/detail?id=${investment.id}`;
            }}
            onRefresh={refetch}
          />
        )}

        {activeTab === 'voting' && (
          <VotingTab _onBackToOverview={() => setActiveTab('overview')} />
        )}

        {activeTab === 'transactions' && (
          <TransactionsTab onBackToOverview={() => setActiveTab('overview')} />
        )}
      </div>
    </Layout>
  );
}

export default function InvestorDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvestorDashboardContent />
    </Suspense>
  );
}
