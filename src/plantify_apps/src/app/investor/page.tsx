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

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button, Card, LoadingSpinner } from '@/components/ui';
import { OverviewTab, PortfolioTab, VotingTab, TransactionsTab } from './tabs';

import { InvestorService } from '@/services/investors/InvestorService';

interface DashboardData {
  loading: boolean;
  error?: string | null;
  totalInvested: number;
  totalReturns: number;
  returnPercentage: number;
  monthlyCommitments: number;
  activeInvestments: number;
  upcomingVotes: number;
  votingPending: number;
}

export default function InvestorDashboard() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'portfolio' | 'voting' | 'transactions'
  >('overview');

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    loading: true,
    error: null,
    totalInvested: 0,
    totalReturns: 0,
    returnPercentage: 0,
    monthlyCommitments: 0,
    activeInvestments: 0,
    upcomingVotes: 0,
    votingPending: 0,
  });

  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [investor, setInvestor] = useState<{ fullName?: string } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const investorData = await InvestorService.getInvestorByPrincipal();
        setInvestor(investorData);

        const investorId =
          (investorData as any)?.investor_id ||
          (investorData as any)?.id ||
          (investorData as any)?.investorId ||
          null;

        if (investorId) {
          const historyRes = await InvestorService.getInvestorPurchaseHistory(investorId);

          if (historyRes.success) {
            const history = Array.isArray(historyRes.history)
              ? historyRes.history
              : historyRes.history
                ? [historyRes.history]
                : [];
            setPurchaseHistory(history as any[]);
          } else {
            setError(historyRes.error || 'Gagal memuat riwayat pembelian');
          }
        }

        setDashboardData(prev => ({
          ...prev,
          loading: false,
          totalInvested: 10000,
          totalReturns: 2500,
          returnPercentage: 25,
          monthlyCommitments: 500,
          activeInvestments: 3,
          upcomingVotes: 2,
          votingPending: 1,
        }));
      } catch (err) {
        console.error(err);
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: 'Gagal memuat data investor',
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refetch = () => window.location.reload();

  // === Loading State ===
  if (loading || dashboardData.loading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Navbar />
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <LoadingSpinner className='mx-auto mb-4' />
              <p className='text-gray-600'>Loading dashboard...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // === Error State ===
  if (dashboardData.error) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Navbar />
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
                <Button
                  variant='secondary'
                  onClick={() => console.log('Navigate to register')}
                >
                  Register as Investor
                </Button>
              </div>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // === Main Render ===
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

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
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'portfolio', label: 'My Portfolio', icon: TrendingUp },
              { id: 'voting', label: 'Voting', icon: Vote },
              { id: 'transactions', label: 'Transactions', icon: CreditCard },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
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

        {/* === Tab Content === */}
        {activeTab === 'overview' && (
          <OverviewTab
            dashboardData={dashboardData}
            matchingStartups={[]}
            recentActivity={purchaseHistory}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioTab
            portfolioData={{
              loading: false,   
              investments: [],  
              error: undefined, 
            }}
            onViewDetails={() => { }}
            onVoteReport={() => { }}
            onAddInvestment={() => { }}
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

      <Footer />
    </div>
  );
}
