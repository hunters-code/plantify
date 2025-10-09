import React, { useState, useEffect } from "react";
import { StatsCard } from "@/components/ui";
import { formatCurrency, formatNumber } from "@/utils/formatCurrency";
import { FounderService } from "@/services/founders/FounderService";

interface DashboardStats {
  totalFundingRaised: number;
  nftHolders: number;
  monthlyCommitments: number;
  activeStartups: number;
  pendingStartups: number;
  draftStartups: number;
  totalReports: number;
  totalVotes: number;
  averageApprovalRate: number;
  loading: boolean;
  error: string | null;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
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
        setStats((prev) => ({ ...prev, loading: true, error: null }));

        const [founder, startups] = await Promise.all([
          FounderService.getFounderByPrincipal(),
          FounderService.getFounderStartups(),
        ]);

        if (!founder) {
          setStats((prev) => ({
            ...prev,
            loading: false,
            error: "Founder not found",
          }));
          return;
        }

        // Hitung jumlah startup berdasarkan status
        const activeStartups = startups.filter(
          (s) => s.status?.toLowerCase() === "active"
        ).length;
        const pendingStartups = startups.filter(
          (s) => s.status?.toLowerCase() === "pending"
        ).length;
        const draftStartups = startups.filter(
          (s) => s.status?.toLowerCase() === "draft"
        ).length;

        // Total dana yang sudah dikumpulkan
        const totalFundingRaised = startups.reduce(
          (sum, s) => sum + Number(s.currentFunding || 0),
          0
        );

        // Jumlah NFT holder unik
        const nftHolders = startups.reduce(
          (sum, s) => sum + Number(s.investorCount || 0),
          0
        );

        // Komitmen bulanan
        const monthlyCommitments = startups.reduce(
          (sum, s) => sum + Number(s.monthlyCommitment || 0),
          0
        );

        // Total laporan
        const totalReports = startups.reduce(
          (sum, s) => sum + Number(s.reportCount || 0),
          0
        );

        // Total votes
        const totalVotes = startups.reduce(
          (sum, s) => sum + Number(s.totalVotes || 0),
          0
        );

        // Rata-rata approval rate
        const approvalRates = startups
          .map((s) => Number(s.approvalRate || 0))
          .filter((r) => r > 0);

        const averageApprovalRate =
          approvalRates.length > 0
            ? approvalRates.reduce((sum, r) => sum + r, 0) /
              approvalRates.length
            : 0;

        setStats({
          totalFundingRaised,
          nftHolders,
          monthlyCommitments,
          activeStartups,
          pendingStartups,
          draftStartups,
          totalReports,
          totalVotes,
          averageApprovalRate: Math.round(averageApprovalRate),
          loading: false,
          error: null,
        });
      } catch (err: any) {
        console.error("Error fetching dashboard stats:", err);
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: err.message || "Failed to fetch dashboard statistics",
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
}

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
      label: "Total Funding Raised",
      value: stats.loading ? "-" : formatCurrency(stats.totalFundingRaised),
      subtitle: "ckUSDC",
      loading: stats.loading,
      error: stats.error,
    },
    {
      label: "NFT Holders",
      value: stats.loading ? "-" : formatNumber(stats.nftHolders),
      subtitle: "active investors",
      loading: stats.loading,
      error: stats.error,
    },
    {
      label: "Monthly Commitments",
      value: stats.loading ? "-" : formatCurrency(stats.monthlyCommitments),
      subtitle: "ckUSDC/month",
      loading: stats.loading,
      error: stats.error,
    },
    {
      label: "Active Startups",
      value: stats.loading ? "-" : formatNumber(stats.activeStartups),
      subtitle: `of ${
        stats.activeStartups + stats.pendingStartups + stats.draftStartups
      } total`,
      loading: stats.loading,
      error: stats.error,
    },
    {
      label: "Monthly Reports",
      value: stats.loading ? "-" : formatNumber(stats.totalReports),
      subtitle: "submitted reports",
      loading: stats.loading,
      error: stats.error,
    },
    {
      label: "Total Votes",
      value: stats.loading ? "-" : formatNumber(stats.totalVotes),
      subtitle: "investor votes",
      loading: stats.loading,
      error: stats.error,
    },
    {
      label: "Approval Rate",
      value: stats.loading
        ? "-"
        : `${formatNumber(stats.averageApprovalRate)}%`,
      subtitle: "average approval",
      loading: stats.loading,
      error: stats.error,
    },
    {
      label: "Pending Startups",
      value: stats.loading ? "-" : formatNumber(stats.pendingStartups),
      subtitle: "awaiting collateral",
      loading: stats.loading,
      error: stats.error,
    },
    {
      label: "Draft Startups",
      value: stats.loading ? "-" : formatNumber(stats.draftStartups),
      subtitle: "in development",
      loading: stats.loading,
      error: stats.error,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
