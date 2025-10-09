import { formatCurrency, formatNumber } from "@/utils/formatCurrency";

export interface StatItem {
  label: string;
  value: string | number;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
}

export interface DashboardStatsData {
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

export const getDashboardStatsItems = (
  stats: DashboardStatsData
): StatItem[] => [
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