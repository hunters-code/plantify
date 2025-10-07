import React from 'react';

import { StatsCard } from '@/components/ui';
import { formatCurrency, formatNumber } from '@/utils/formatCurrency';

const useDashboardStats = () => {
  return {
    totalFundingRaised: 4800000,
    nftHolders: 1250,
    monthlyCommitments: 240000,
    activeStartups: 12,
    pendingStartups: 3,
    draftStartups: 2,
    totalReports: 58,
    totalVotes: 3200,
    averageApprovalRate: 92,
    loading: false,
    error: null,
  };
};

interface StatItem {
  label: string;
  value: string | number;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
}

const DashboardOverview: React.FC = () => {
  const stats = useDashboardStats();

  const items: StatItem[] = [
    {
      label: 'Total Funding Raised',
      value: formatCurrency(stats.totalFundingRaised),
      subtitle: 'ckUSDC',
      loading: stats.loading,
      error: stats.error,
    },
    {
      label: 'NFT Holders',
      value: formatNumber(stats.nftHolders),
      subtitle: 'active investors',
      loading: stats.loading,
      error: stats.error,
    },
    {
      label: 'Monthly Commitments',
      value: formatCurrency(stats.monthlyCommitments),
      subtitle: 'ckUSDC/month',
      loading: stats.loading,
      error: stats.error,
    },
    {
      label: 'Active Startups',
      value: formatNumber(stats.activeStartups),
      subtitle: `of ${
        stats.activeStartups + stats.pendingStartups + stats.draftStartups
      } total`,
      loading: stats.loading,
      error: stats.error,
    },
    {
      label: 'Monthly Reports',
      value: formatNumber(stats.totalReports),
      subtitle: 'submitted reports',
      loading: stats.loading,
      error: stats.error,
    },
    {
      label: 'Total Votes',
      value: formatNumber(stats.totalVotes),
      subtitle: 'investor votes',
      loading: stats.loading,
      error: stats.error,
    },
    {
      label: 'Approval Rate',
      value: `${formatNumber(stats.averageApprovalRate)}%`,
      subtitle: 'average approval',
      loading: stats.loading,
      error: stats.error,
    },
    {
      label: 'Pending Startups',
      value: formatNumber(stats.pendingStartups),
      subtitle: 'awaiting collateral',
      loading: stats.loading,
      error: stats.error,
    },
    {
      label: 'Draft Startups',
      value: formatNumber(stats.draftStartups),
      subtitle: 'in development',
      loading: stats.loading,
      error: stats.error,
    },
  ];

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
      {items.map((item, i) => (
        <StatsCard
          key={i}
          label={item.label}
          value={item.value}
          subtitle={item.subtitle}
          loading={item.loading}
          error={item.error}
        />
      ))}
    </div>
  );
};

export default DashboardOverview;
