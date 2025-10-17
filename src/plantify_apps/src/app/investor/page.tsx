'use client';

import React, { useState, useEffect } from 'react';

import {
  Eye,
  Vote,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  LucideIcon,
} from 'lucide-react';

import { Layout } from '@/components';
import { Button } from '@/components/ui';
import type {
  MyInvestmentPortfolio,
  NFTPurchaseInfo,
  PortfolioItem,
} from '@/declarations/plantify_backend/plantify_backend.did';
import { InvestorService } from '@/services/investors/InvestorService';

import { OverviewTab, PortfolioTab, VotingTab, TransactionsTab } from './tabs';

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

export default function InvestorDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
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
  const [purchaseHistory, setPurchaseHistory] = useState<NFTPurchaseInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [investor, setInvestor] = useState<{ fullName?: string } | null>(null);

  // Portfolio state
  const [portfolioData, setPortfolioData] = useState<{
    loading: boolean;
    investments: any[];
    error?: string;
  }>({
    loading: true,
    investments: [],
  });
  const [portfolio, setPortfolio] = useState<MyInvestmentPortfolio | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setPortfolioData(prev => ({ ...prev, loading: true }));

        // Fetch investor profile
        const investorData = await InvestorService.getInvestorByPrincipal();

        if (!investorData) {
          setError('Investor not found. Please register as an investor.');
          setLoading(false);
          return;
        }

        // Fetch portfolio data using getMyInvestmentPortfolio
        const portfolioResult =
          await InvestorService.getMyInvestmentPortfolio();

        if (portfolioResult.success && portfolioResult.portfolio) {
          setPortfolio(portfolioResult.portfolio);

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
        setDashboardData(prev => ({
          ...prev,
          error: 'Gagal memuat data investor',
        }));
        setPortfolioData({
          loading: false,
          investments: [],
          error: 'Failed to load portfolio data',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateDashboardMetrics = (
    history: NFTPurchaseInfo[]
  ): DashboardData => {
    let totalInvested = 0;
    const startupSet = new Set<string>();

    history.forEach((purchase: NFTPurchaseInfo) => {
      totalInvested += Number(purchase.amount);
      startupSet.add(purchase.startupId);
    });

    const returnPercentage = 25;
    const totalReturns = Math.floor(totalInvested * (returnPercentage / 100));
    const monthlyCommitments = Math.floor(totalInvested / 12);

    return {
      totalInvested,
      totalReturns,
      returnPercentage,
      monthlyCommitments,
      activeInvestments: startupSet.size,
      upcomingVotes: 0,
      votingPending: 0,
      recentInvestments: [],
      uniqueStartupsInvested: 0,
      averageInvestmentPerStartup: 0,
      totalNFTsOwned: 0,
    };
  };

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
          <div className='flex items-center justify-between'>
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
          </div>

          {/* Tabs */}
          <div className='flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mt-4'>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
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
          <OverviewTab
            dashboardData={dashboardData}
            matchingStartups={[]}
            recentActivity={purchaseHistory}
          />
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
          <VotingTab onBackToOverview={() => setActiveTab('overview')} />
        )}

        {activeTab === 'transactions' && (
          <TransactionsTab onBackToOverview={() => setActiveTab('overview')} />
        )}
      </div>
    </Layout>
  );
}
