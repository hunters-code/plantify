import React, { useState, useEffect } from 'react';

import { StatsCard } from '@/components/ui';
import {
  getDashboardStatsItems,
  DashboardStatsData,
} from '@/constants/dashboardFounderStats';
import { FounderService } from '@/services/founders/FounderService';
import { formatCurrency, formatNumber } from '@/utils/formatCurrency';

// Extended Startup type with additional properties
interface ExtendedStartup {
  status?: string;
  currentFunding?: number;
  investorCount?: number;
  monthlyCommitment?: number;
  reportCount?: number;
  totalVotes?: number;
  approvalRate?: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStatsData>({
    totalFundingRaised: 0,
    nftHolders: 0,
    monthlyCommitments: 0,
    activeStartups: 0,
    pendingStartups: 0,
    draftStartups: 0,
    totalReports: 0,
    totalVotes: 0,
    averageApprovalRate: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        // Use the new getFounderDashboardOverview API endpoint
        const result = await FounderService.getFounderDashboardOverview();

        if (result.success && result.data) {
          const data = result.data;

          // Get data for reports and votes (these are not in the dashboard overview)
          const startupsData = await FounderService.getFounderStartups();
          const startups = startupsData as ExtendedStartup[];

          const totalReports = startups.reduce(
            (sum, s) => sum + Number(s.reportCount || 0),
            0
          );

          const totalVotes = startups.reduce(
            (sum, s) => sum + Number(s.totalVotes || 0),
            0
          );

          const approvalRates = startups
            .map(s => Number(s.approvalRate || 0))
            .filter(r => r > 0);

          const averageApprovalRate =
            approvalRates.length > 0
              ? approvalRates.reduce((sum, r) => sum + r, 0) /
                approvalRates.length
              : 0;

          setStats({
            totalFundingRaised: Number(data.totalFundingRaised),
            nftHolders: Number(data.totalNFTHolders),
            monthlyCommitments: Number(data.totalMonthlyCommitments),
            activeStartups: Number(data.activeStartups),
            pendingStartups: Number(data.pendingStartups),
            draftStartups: Number(data.draftStartups),
            totalReports,
            totalVotes,
            averageApprovalRate: Math.round(averageApprovalRate),
            loading: false,
            error: null,
          });
        } else {
          setStats(prev => ({
            ...prev,
            loading: false,
            error: result.error || 'Failed to fetch dashboard statistics',
          }));
        }
      } catch (err: any) {
        console.error('Error fetching dashboard stats:', err);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: err.message || 'Failed to fetch dashboard statistics',
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
}

const DashboardOverview: React.FC = () => {
  const stats = useDashboardStats();
  const items = getDashboardStatsItems(stats);

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
