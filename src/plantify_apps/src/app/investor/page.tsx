'use client';

import {
  Eye,
  Vote,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Layout } from '@/components';
import { Button, Card, LoadingSpinner } from '@/components/ui';

import { OverviewTab, PortfolioTab, VotingTab, TransactionsTab } from './tabs';

interface Investment {
  startupId: string;
  name: string;
}

interface DashboardData {
  loading: boolean;
  error?: string | null;
  totalInvested: number;
  totalReturns: number;
  returnPercentage: number;
  monthlyCommitments: number;
  activeInvestments: number;
  upcomingVotes: number;
}

export default function InvestorDashboard() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'portfolio' | 'voting' | 'transactions'
  >('overview');

  // ========== Dummy Data ==========
  const dashboardData: DashboardData = {
    loading: false,
    error: null,
    totalInvested: 10000,
    totalReturns: 2500,
    returnPercentage: 25,
    monthlyCommitments: 500,
    activeInvestments: 3,
    upcomingVotes: 2,
  };

  const portfolioData = {
    loading: false,
    error: null,
    investments: [{ startupId: '1', name: 'Startup A' }],
  };

  const matchingStartups = [{ id: 's1', name: 'Cool Startup' }];
  const recentActivity = [{ id: 'a1', message: 'Invested in Startup A' }];
  const investor = { fullName: 'John Doe' };
  const isAuthenticated = true;
  const authLoading = false;

  const refetch = () => {};
  const refetchPortfolio = () => {};

  // ========== Handlers ==========
  const handleViewDetails = (investment: Investment) => {
    // Handle view details
  };

  const handleVoteReport = (investment: Investment) => {
    // Handle vote report
  };

  const handleAddInvestment = (investment: Investment) => {
    // Handle add investment
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'portfolio', label: 'My Portfolio', icon: TrendingUp },
    { id: 'voting', label: 'Voting', icon: Vote },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
  ] as const;

  // Debug log
  useEffect(() => {
    // Debug info
  }, [activeTab]);

  // ========== Loading State ==========
  if (
    authLoading ||
    (activeTab === 'overview' && dashboardData.loading) ||
    (activeTab === 'portfolio' && portfolioData.loading)
  ) {
    return (
      <Layout>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <LoadingSpinner className='mx-auto mb-4' />
              <p className='text-gray-600'>Loading dashboard...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ========== Error State ==========
  if (activeTab === 'overview' && dashboardData.error) {
    return (
      <Layout>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <Card className='p-8'>
            <div className='text-center'>
              <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                Error Loading Dashboard
              </h3>
              <p className='text-gray-600 mb-4'>{dashboardData.error}</p>
              <div className='flex gap-2 justify-center'>
                <Button variant='primary' onClick={refetch}>
                  Try Again
                </Button>
                <Button variant='secondary' onClick={() => {}}>
                  Register as Investor
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  // ========== Main Render ==========
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
                  Welcome back, {investor.fullName}
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
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
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
