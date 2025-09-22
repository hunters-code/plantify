import React, { useState, useEffect } from 'react';
import { Eye, Vote, CreditCard, TrendingUp, ArrowUpRight, Loader2, AlertCircle } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Button, Card, LoadingSpinner } from '../../components/ui';
import { OverviewTab, PortfolioTab, VotingTab, TransactionsTab } from './tabs';
import { useInvestorDashboard } from '../../hooks/useInvestorDashboard';
import { useInvestorPortfolio } from '../../hooks/useInvestorPortfolio';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function InvestorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { dashboardData, matchingStartups, recentActivity, investor, refetch } = useInvestorDashboard();
  const { portfolioData, refetch: refetchPortfolio } = useInvestorPortfolio();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Handle investment card actions
  const handleViewDetails = (investment) => {
    navigate(`/startup/${investment.startupId}`);
  };

  const handleVoteReport = (investment) => {
    // TODO: Navigate to voting page when implemented
    console.log('Vote on report for:', investment.name);
  };

  const handleAddInvestment = (investment) => {
    navigate(`/explore/detail/${investment.startupId}`);
  };

  // Handle refresh actions
  const handleRefreshAll = () => {
    refetch();
    refetchPortfolio();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'portfolio', label: 'My Portfolio', icon: TrendingUp },
    { id: 'voting', label: 'Voting', icon: Vote },
    { id: 'transactions', label: 'Transactions', icon: CreditCard }
  ];

  // Debug logging
  useEffect(() => {
    console.log('Investor Dashboard Debug:', {
      activeTab,
      isAuthenticated,
      authLoading,
      dashboardLoading: dashboardData.loading,
      portfolioLoading: portfolioData.loading,
      dashboardError: dashboardData.error,
      portfolioError: portfolioData.error,
      investmentsCount: portfolioData.investments?.length || 0
    });
  }, [activeTab, isAuthenticated, authLoading, dashboardData, portfolioData]);

  // Show loading state
  if (authLoading || (activeTab === 'overview' && dashboardData.loading) || (activeTab === 'portfolio' && portfolioData.loading)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <LoadingSpinner className="mx-auto mb-4" />
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state for overview tab
  if (activeTab === 'overview' && dashboardData.error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
              <p className="text-gray-600 mb-4">{dashboardData.error}</p>
              <div className="flex gap-2 justify-center">
                <Button variant="primary" onClick={refetch}>
                  Try Again
                </Button>
                <Button variant="secondary" onClick={() => navigate('/register/investor')}>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Investor Dashboard</h1>
              {investor && (
                <p className="text-gray-600">Welcome back, {investor.fullName}</p>
              )}
            </div>
            <Button variant="secondary" onClick={refetch} className="flex items-center gap-2">
              <ArrowUpRight size={16} />
              Refresh
            </Button>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mt-4">
            {tabs.map((tab) => {
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

        {activeTab === 'overview' && (
          <OverviewTab 
            dashboardData={dashboardData}
            matchingStartups={matchingStartups}
            recentActivity={recentActivity}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioTab 
            portfolioData={portfolioData}
            onViewDetails={handleViewDetails}
            onVoteReport={handleVoteReport}
            onAddInvestment={handleAddInvestment}
            onRefresh={refetchPortfolio}
          />
        )}

        {activeTab === 'voting' && (
          <VotingTab 
            onBackToOverview={() => setActiveTab('overview')}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsTab 
            onBackToOverview={() => setActiveTab('overview')}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
