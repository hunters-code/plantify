'use client';

import {
  Eye,
  Vote,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Layout } from '@/components';
import { Button } from '@/components/ui';
import { OverviewTab, PortfolioTab, VotingTab, TransactionsTab } from './tabs';

import { InvestorService } from '@/services/investors/InvestorService';
import type {
  Investor,
  NFTPurchaseHistory,
  NFTPurchaseInfo
} from '@/declarations/plantify_backend/plantify_backend.did';

interface DashboardData {
  totalInvested: number;
  totalReturns: number;
  returnPercentage: number;
  monthlyCommitments: number;
  activeInvestments: number;
  upcomingVotes: number;
  votingPending: number;
}

type TabType = 'overview' | 'portfolio' | 'voting' | 'transactions';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
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
  });
  const [purchaseHistory, setPurchaseHistory] = useState<NFTPurchaseInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const investorData = await InvestorService.getInvestorByPrincipal();

        if (!investorData) {
          setError('Investor not found. Please register as an investor.');
          setLoading(false);
          return;
        }

        setInvestor(investorData);

        const historyResult = await InvestorService.getInvestorPurchaseHistory(
          investorData.id
        );

        if (historyResult.success && historyResult.history) {
          const purchases = historyResult.history.purchases;
          setPurchaseHistory(purchases);

          // Calculate dashboard metrics from purchase history
          const metrics = calculateDashboardMetrics(historyResult.history);
          setDashboardData(metrics);
        } else {
          setError(historyResult.error || 'Failed to load purchase history');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load investor data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateDashboardMetrics = (
    history: NFTPurchaseHistory
  ): DashboardData => {
    let totalInvested = 0;
    const startupSet = new Set<string>();

    history.purchases.forEach(purchase => {
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
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
            onViewDetails={(investment) => {
              console.log('View details:', investment);
            }}
            onVoteReport={(investment) => {
              console.log('Vote on report:', investment);
            }}
            onAddInvestment={(investment) => {
              console.log('Add investment:', investment);
            }}
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