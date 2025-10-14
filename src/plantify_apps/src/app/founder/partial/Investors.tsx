'use client';

import {
  Search,
  Filter,
  Eye,
  MessageCircle,
  MapPin,
  Users,
  TrendingUp,
  Award,
  Activity,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { Badge, Button, Card, CardSkeleton } from '@/components/ui';
import type {
  Investor,
  NFTPurchaseHistory,
  NFTPurchaseInfo,
  InvestorVote,
  InvestorDashboard,
  TopInvestor,
  RecentInvestmentSummary,
  InvestorGrowthData,
} from '@/declarations/plantify_backend/plantify_backend.did';
import { InvestorService } from '@/services/investors/InvestorService';
import { VotingService } from '@/services/investors/VotingService';
import { StartupService } from '@/services/marketplace/StartupService';
import { formatCurrency, formatNumber } from '@/utils/formatCurrency';

interface InvestorWithStats {
  id: string;
  fullName: string;
  email: string;
  city: string;
  country: string;
  principal: { toText: () => string };
  bio?: string;
  occupation?: string;
  riskTolerance?: string;
  monthlyBudget?: number;
  investmentGoals?: string[];
  preferredSectors?: string[];
  totalInvestment: number;
  nftsOwned: number;
  profitReceived: number;
  participation: number;
  badges: string[];
  lastActivity?: Date;
}

function useInvestors(startupId?: string) {
  const [investors, setInvestors] = useState<InvestorWithStats[]>([]);
  const [topInvestors, setTopInvestors] = useState<TopInvestor[]>([]);
  const [recentInvestments, setRecentInvestments] = useState<
    RecentInvestmentSummary[]
  >([]);
  const [investorGrowth, setInvestorGrowth] = useState<InvestorGrowthData[]>(
    []
  );
  const [dashboard, setDashboard] = useState<InvestorDashboard | null>(null);
  const [purchaseHistory, setPurchaseHistory] =
    useState<NFTPurchaseHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestorData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch investor dashboard data
        const dashboardResult = await InvestorService.getInvestorDashboard();

        if (dashboardResult.success && dashboardResult.dashboard) {
          const dashboardData = dashboardResult.dashboard;
          setDashboard(dashboardData);
          setTopInvestors(dashboardData.topInvestors || []);
          setRecentInvestments(dashboardData.recentInvestments || []);
          setInvestorGrowth(dashboardData.investorGrowth || []);

          // Convert TopInvestor to InvestorWithStats for compatibility with existing UI
          const mappedInvestors: InvestorWithStats[] =
            dashboardData.topInvestors.map(investor => {
              // Determine badges based on investment amount
              const totalInvestment = Number(investor.totalInvested) / 100;
              const badges: string[] = [];
              if (totalInvestment > 5000) badges.push('VIP');

              // Calculate participation (this is an estimate since we don't have total raised in the dashboard)
              const participation = 10; // Default value since we can't calculate it accurately

              if (participation > 10) badges.push('Active');
              if (participation < 5) badges.push('Inactive');

              return {
                id: investor.investorId,
                fullName: investor.investorName,
                email: '', // Not available in TopInvestor
                city: '', // Not available in TopInvestor
                country: '', // Not available in TopInvestor
                principal: { toText: () => '' }, // Not available in TopInvestor
                totalInvestment,
                nftsOwned: Number(investor.numberOfInvestments),
                profitReceived: 0, // Not available in TopInvestor
                participation,
                badges,
                lastActivity: new Date(
                  Number(investor.lastInvestmentDate) / 1000000
                ),
              };
            });

          setInvestors(mappedInvestors);
        } else {
          setError(
            dashboardResult.error || 'Failed to load investor dashboard'
          );
        }

        // If startupId is provided, fetch startup-specific purchase history
        if (startupId) {
          const purchaseHistoryResult =
            await StartupService.getStartupPurchaseHistory(startupId);
          if (purchaseHistoryResult.success && purchaseHistoryResult.history) {
            setPurchaseHistory(purchaseHistoryResult.history);
          }
        }
      } catch (err) {
        console.error('Error fetching investor data:', err);
        setError('Failed to load investor data');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestorData();
  }, [startupId]);

  // Get metrics from dashboard or calculate from investors
  const totalInvestment = dashboard
    ? Number(dashboard.totalInvestmentAmount) / 100
    : investors.reduce((sum, investor) => sum + investor.totalInvestment, 0);

  const totalInvestors = dashboard
    ? Number(dashboard.totalInvestors)
    : investors.length;

  const activeInvestors = dashboard
    ? Number(dashboard.activeInvestors)
    : investors.filter(i => i.participation > 10).length;

  const newInvestorsThisMonth = dashboard
    ? Number(dashboard.newInvestorsThisMonth)
    : 0;

  const averageInvestmentPerInvestor = dashboard
    ? Number(dashboard.averageInvestmentPerInvestor) / 100
    : totalInvestors > 0
      ? totalInvestment / totalInvestors
      : 0;

  const vipInvestors = investors.filter(i => i.totalInvestment > 5000).length;

  const averageParticipation =
    totalInvestors > 0
      ? investors.reduce((sum, investor) => sum + investor.participation, 0) /
        totalInvestors
      : 0;

  return {
    investors,
    topInvestors,
    recentInvestments,
    investorGrowth,
    totalInvestment,
    totalInvestors,
    activeInvestors,
    vipInvestors,
    newInvestorsThisMonth,
    averageInvestmentPerInvestor,
    averageParticipation,
    purchaseHistory,
    loading,
    error,
  };
}

interface InvestorsProps {
  startupId?: string;
}

export default function Investors({ startupId }: InvestorsProps) {
  const {
    investors,
    topInvestors,
    recentInvestments,
    investorGrowth,
    totalInvestment,
    totalInvestors,
    activeInvestors,
    vipInvestors,
    newInvestorsThisMonth,
    averageInvestmentPerInvestor,
    averageParticipation,
    purchaseHistory,
    loading,
    error,
  } = useInvestors(startupId);

  const [activeInvestorTab, setActiveInvestorTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<
    'all' | 'active' | 'vip' | 'inactive'
  >('all');

  // Filter investors based on search and filter
  const filteredInvestors = investors.filter(investor => {
    const matchesSearch =
      searchTerm === '' ||
      investor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'active' && investor.participation > 10) ||
      (filterType === 'vip' && investor.totalInvestment > 5000) ||
      (filterType === 'inactive' && investor.participation < 5);

    return matchesSearch && matchesFilter;
  });

  const investorTabs = [
    { label: 'Overview' },
    { label: 'Investor list' },
    { label: 'Analytics' },
    { label: 'Engagement' },
  ];

  const getBadgeVariant = (badge: string) => {
    if (badge.includes('VIP')) return 'primary';
    if (badge.includes('Active')) return 'success';
    if (badge.includes('Inactive')) return 'warning';
    return 'secondary';
  };

  if (loading) return <CardSkeleton textRows={4} withImage />;

  if (error)
    return (
      <Card className='bg-red-50 border border-red-200 p-6 text-center'>
        <div className='text-red-600'>
          <h2 className='text-xl font-semibold mb-2'>
            Error Loading Investors
          </h2>
          <p>{error}</p>
        </div>
      </Card>
    );

  if (!startupId)
    return (
      <Card className='bg-white p-6 text-center'>
        <h2 className='text-xl font-semibold mb-2'>No Startup Selected</h2>
        <p className='text-gray-500'>
          Please select a startup from the dropdown above.
        </p>
      </Card>
    );

  return (
    <div>
      {/* HEADER */}
      <div className='flex justify-between items-center mb-4 bg-neutral-100 p-4 rounded-[16px]'>
        <div>
          <h2 className='text-xl font-semibold'>Investors</h2>
          <p className='text-sm text-gray-500'>
            {formatCurrency(totalInvestment)} (
            {formatNumber(averageParticipation, 1)}% avg participation)
          </p>
        </div>
        <div className='text-right'>
          <span className='text-sm text-gray-500'>
            {new Date().toLocaleDateString()}
          </span>
          <Badge variant='success' className='ml-2'>
            Active
          </Badge>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className='space-y-4 mb-6 bg-neutral-100 p-4 rounded-[16px]'>
        <div>
          <Card className='text-center p-6'>
            <div className='flex items-center justify-center mb-3'>
              <TrendingUp className='w-6 h-6 text-green-500 mr-2' />
            </div>
            <div className='text-3xl font-bold text-gray-900 mb-1'>
              {formatCurrency(totalInvestment)}
            </div>
            <div className='text-sm text-gray-500'>Total Investment</div>
          </Card>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Card className='text-center p-4'>
            <div className='flex items-center justify-center mb-2'>
              <Users className='w-5 h-5 text-blue-500 mr-2' />
            </div>
            <div className='text-2xl font-bold text-gray-900 mb-1'>
              {totalInvestors}
            </div>
            <div className='text-sm text-gray-500'>Total Investors</div>
          </Card>

          <Card className='text-center p-4'>
            <div className='flex items-center justify-center mb-2'>
              <Activity className='w-5 h-5 text-purple-500 mr-2' />
            </div>
            <div className='text-2xl font-bold text-gray-900 mb-1'>
              {activeInvestors}
            </div>
            <div className='text-sm text-gray-500'>Active Investors</div>
          </Card>

          <Card className='text-center p-4'>
            <div className='flex items-center justify-center mb-2'>
              <Award className='w-5 h-5 text-orange-500 mr-2' />
            </div>
            <div className='text-2xl font-bold text-gray-900 mb-1'>
              {newInvestorsThisMonth}
            </div>
            <div className='text-sm text-gray-500'>New This Month</div>
          </Card>

          <Card className='text-center p-4'>
            <div className='flex items-center justify-center mb-2'>
              <TrendingUp className='w-5 h-5 text-indigo-500 mr-2' />
            </div>
            <div className='text-2xl font-bold text-gray-900 mb-1'>
              {formatCurrency(averageInvestmentPerInvestor)}
            </div>
            <div className='text-sm text-gray-500'>Avg Investment</div>
          </Card>
        </div>
      </div>

      <div className='bg-neutral-100 p-4 rounded-[16px]'>
        <div className='flex gap-4 mb-6'>
          <div className='flex-1 relative'>
            <Search
              size={16}
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
            />
            <input
              type='text'
              placeholder='Search investors by name, email, or ID'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='w-full bg-white pl-10 pr-4 py-2 border border-gray-300 rounded-[16px] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
          </div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as any)}
            className='px-4 py-2 bg-white border border-gray-300 rounded-[16px] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
          >
            <option value='all'>Filter</option>
            <option value='active'>Active (10%)</option>
            <option value='vip'>VIP ($5K)</option>
            <option value='inactive'>Inactive (5%)</option>
          </select>
          <div className='flex items-center text-sm text-gray-500'>
            {filteredInvestors.length} of {totalInvestors} investors
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className='mb-4 border border-gray-200 rounded-[16px] flex'>
          {investorTabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveInvestorTab(index)}
              className={`px-4 py-2 text-sm font-medium transition rounded-[12px] ${
                activeInvestorTab === index
                  ? 'bg-[#F5F5F5] text-black shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 0 — OVERVIEW */}
        {activeInvestorTab === 0 && (
          <div className='space-y-6'>
            <div className='flex justify-between items-center'>
              <h4 className='text-sm font-semibold'>Top Investors</h4>
              <span className='text-sm text-gray-500'>
                Showing top {Math.min(10, filteredInvestors.length)} investors
              </span>
            </div>
            <div className='space-y-3'>
              {filteredInvestors.slice(0, 10).map((investor, index) => (
                <Card
                  key={investor.id}
                  className='p-4 bg-white border border-gray-200 flex justify-between items-center'
                >
                  <div>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium'>
                        #{index + 1} {investor.fullName}
                      </span>
                      <div className='flex gap-1'>
                        {investor.badges.map((badge, badgeIndex) => (
                          <Badge
                            key={badgeIndex}
                            variant={getBadgeVariant(badge)}
                            size='sm'
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className='text-sm text-gray-500 mt-1'>
                      {investor.email} • {investor.nftsOwned} NFTs owned
                    </div>
                    {investor.lastActivity && (
                      <div className='text-xs text-gray-400 mt-1'>
                        Last activity:{' '}
                        {investor.lastActivity.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className='text-right text-sm'>
                    <div className='font-medium text-green-600'>
                      {formatCurrency(investor.totalInvestment)}
                    </div>
                    <div className='text-gray-500'>
                      {investor.participation}% participation
                    </div>
                    <div className='text-xs text-gray-400'>
                      {investor.city}, {investor.country}
                    </div>
                  </div>
                </Card>
              ))}
              {filteredInvestors.length === 0 && (
                <Card className='p-6 text-center bg-gray-50'>
                  <Users size={32} className='mx-auto text-gray-400 mb-2' />
                  <p className='text-gray-500'>No investors found</p>
                  <p className='text-gray-400 text-sm mt-1'>
                    Try adjusting your search or filter criteria
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* TAB 1 — INVESTOR LIST */}
        {activeInvestorTab === 1 && (
          <div className='space-y-4'>
            {filteredInvestors.map(investor => (
              <Card
                key={investor.id}
                className='p-4 bg-white border border-gray-200'
              >
                <div className='flex justify-between mb-3'>
                  <div>
                    <h5 className='font-medium'>{investor.fullName}</h5>
                    <p className='text-sm text-gray-500'>
                      ID: {investor.id.slice(0, 16)}...
                    </p>
                    <div className='flex gap-1 mt-2'>
                      {investor.badges.map((badge, badgeIndex) => (
                        <Badge
                          key={badgeIndex}
                          variant={getBadgeVariant(badge)}
                          size='sm'
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <Button variant='secondary'>
                      <Eye size={14} />
                      View
                    </Button>
                    <Button variant='secondary'>
                      <MessageCircle size={14} />
                      Message
                    </Button>
                  </div>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                  <div>
                    <span className='text-gray-500'>Investment:</span>
                    <div className='font-medium text-green-600'>
                      {formatCurrency(investor.totalInvestment)}
                    </div>
                  </div>
                  <div>
                    <span className='text-gray-500'>NFTs owned:</span>
                    <div className='font-medium'>{investor.nftsOwned}</div>
                  </div>
                  <div>
                    <span className='text-gray-500'>Profit received:</span>
                    <div className='font-medium'>
                      {formatCurrency(investor.profitReceived)}
                    </div>
                  </div>
                  <div>
                    <span className='text-gray-500'>Participation:</span>
                    <div className='font-medium'>{investor.participation}%</div>
                  </div>
                </div>
                <div className='mt-3 flex justify-between items-center'>
                  <div className='flex items-center text-sm text-gray-500'>
                    <MapPin size={16} className='mr-1' />
                    {investor.city}, {investor.country}
                  </div>
                  {investor.lastActivity && (
                    <div className='text-xs text-gray-400'>
                      Last activity:{' '}
                      {investor.lastActivity.toLocaleDateString()}
                    </div>
                  )}
                </div>
              </Card>
            ))}
            {filteredInvestors.length === 0 && (
              <Card className='p-6 text-center bg-white'>
                <Users size={32} className='mx-auto text-gray-400 mb-2' />
                <p className='text-gray-500'>No investors found</p>
                <p className='text-gray-400 text-sm mt-1'>
                  Try adjusting your search or filter criteria
                </p>
              </Card>
            )}
          </div>
        )}

        {/* TAB 2 — ANALYTICS */}
        {activeInvestorTab === 2 && (
          <div className='space-y-6'>
            <h4 className='text-sm font-semibold mb-4'>Investment Analytics</h4>

            {/* Investment Distribution */}
            <Card className='p-4'>
              <h5 className='font-medium mb-3'>Investment Distribution</h5>
              <div className='space-y-3'>
                {filteredInvestors.slice(0, 5).map((investor, index) => {
                  const percentage =
                    totalInvestment > 0
                      ? (investor.totalInvestment / totalInvestment) * 100
                      : 0;
                  return (
                    <div
                      key={investor.id}
                      className='flex items-center justify-between'
                    >
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium'>
                          #{index + 1}
                        </span>
                        <span className='text-sm'>{investor.fullName}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <div className='w-20 bg-gray-200 rounded-full h-2'>
                          <div
                            className='bg-blue-500 h-2 rounded-full'
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className='text-sm font-medium w-12 text-right'>
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Investment Timeline */}
            <Card className='p-4'>
              <h5 className='font-medium mb-3'>Recent Investments</h5>
              <div className='space-y-2'>
                {recentInvestments.length > 0 ? (
                  recentInvestments.slice(0, 10).map((investment, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0'
                    >
                      <div>
                        <span className='text-sm font-medium'>
                          {investment.investorName}
                        </span>
                        <div className='text-xs text-gray-500'>
                          {new Date(
                            Number(investment.date) / 1000000
                          ).toLocaleDateString()}
                        </div>
                        <div className='text-xs text-gray-400'>
                          {investment.startupName}
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='text-sm font-medium text-green-600'>
                          {formatCurrency(Number(investment.amount) / 100)}
                        </div>
                        <div className='text-xs text-gray-500 uppercase'>
                          {investment.tokenType}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-sm text-gray-500 text-center py-4'>
                    No recent investment data available
                  </p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 3 — ENGAGEMENT */}
        {activeInvestorTab === 3 && (
          <div className='space-y-6'>
            <h4 className='text-sm font-semibold mb-4'>Investor Engagement</h4>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Engagement Metrics */}
              <Card className='p-4'>
                <h5 className='font-medium mb-3'>Engagement Overview</h5>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-500'>
                      Active Investors:
                    </span>
                    <span className='font-medium'>
                      {activeInvestors}/{totalInvestors}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-500'>
                      New This Month:
                    </span>
                    <span className='font-medium'>{newInvestorsThisMonth}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-500'>
                      Avg Investment:
                    </span>
                    <span className='font-medium'>
                      {formatCurrency(averageInvestmentPerInvestor)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-500'>
                      VIP Investors:
                    </span>
                    <span className='font-medium'>{vipInvestors}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-500'>
                      Total Investment:
                    </span>
                    <span className='font-medium text-green-600'>
                      {formatCurrency(totalInvestment)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className='p-4'>
                <h5 className='font-medium mb-3'>Recent Activity</h5>
                <div className='space-y-2'>
                  {filteredInvestors
                    .filter(i => i.lastActivity)
                    .sort(
                      (a, b) =>
                        (b.lastActivity?.getTime() || 0) -
                        (a.lastActivity?.getTime() || 0)
                    )
                    .slice(0, 5)
                    .map(investor => (
                      <div
                        key={investor.id}
                        className='flex justify-between items-center py-2'
                      >
                        <div>
                          <span className='text-sm font-medium'>
                            {investor.fullName}
                          </span>
                          <div className='text-xs text-gray-500'>
                            {investor.lastActivity?.toLocaleDateString()}
                          </div>
                        </div>
                        <Badge
                          variant={getBadgeVariant(
                            investor.badges[0] || 'Active'
                          )}
                          size='sm'
                        >
                          {investor.badges[0] || 'Active'}
                        </Badge>
                      </div>
                    ))}
                  {filteredInvestors.filter(i => i.lastActivity).length ===
                    0 && (
                    <p className='text-sm text-gray-500 text-center py-4'>
                      No recent activity data available
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* Investor Growth */}
            {investorGrowth.length > 0 && (
              <Card className='p-4 mt-6'>
                <h5 className='font-medium mb-3'>Investor Growth</h5>
                <div className='space-y-4'>
                  {investorGrowth.map((data, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center'
                    >
                      <div className='text-sm'>
                        {new Date(
                          Number(data.year),
                          Number(data.month) - 1
                        ).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </div>
                      <div className='flex items-center gap-4'>
                        <div className='flex items-center'>
                          <span className='text-sm text-gray-500 mr-2'>
                            New:
                          </span>
                          <span className='text-sm font-medium'>
                            {Number(data.newInvestors)}
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <span className='text-sm text-gray-500 mr-2'>
                            Total:
                          </span>
                          <span className='text-sm font-medium'>
                            {Number(data.totalInvestors)}
                          </span>
                        </div>
                        <div className='w-24 bg-gray-200 rounded-full h-2'>
                          <div
                            className='bg-blue-500 h-2 rounded-full'
                            style={{
                              width: `${Math.min(100, (Number(data.totalInvestors) / Math.max(...investorGrowth.map(g => Number(g.totalInvestors)))) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
