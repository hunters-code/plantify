'use client';

import {
  Eye,
  Plus,
  AlertTriangle,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { Badge, Button, Card } from '@/components/ui';
import type {
  MonthlyReport,
  MonthlyReportList,
  MonthlyReportStats,
  InvestorVote,
  VotingStats,
  Investor,
} from '@/declarations/plantify_backend/plantify_backend.did';
import { MonthlyReportService } from '@/services/founders/MonthlyReportService';
import { InvestorService } from '@/services/investors/InvestorService';
import { VotingService } from '@/services/investors/VotingService';
import { formatCurrency } from '@/utils/formatCurrency';

type PaymentTab = {
  label: string;
};

interface ProfitSharingProps {
  startupId?: string;
}

export default function ProfitSharing({ startupId }: ProfitSharingProps) {
  const [activePaymentTab, setActivePaymentTab] = useState<number>(0);
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [reportStats, setReportStats] = useState<MonthlyReportStats | null>(
    null
  );
  const [votingStats, setVotingStats] = useState<VotingStats | null>(null);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [currentReportVotes, setCurrentReportVotes] = useState<InvestorVote[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfitSharingData = async () => {
      if (!startupId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all required data in parallel
        const [reportsResult, statsResult, votingStatsResult, investorsResult] =
          await Promise.all([
            MonthlyReportService.getMonthlyReportsByStartup(startupId),
            MonthlyReportService.getMonthlyReportStats(),
            VotingService.getVotingStats(),
            InvestorService.getAllInvestors(),
          ]);

        if (reportsResult.success && reportsResult.reportList) {
          setReports(reportsResult.reportList.reports);

          // Get votes for the most recent submitted report
          const submittedReports = reportsResult.reportList.reports.filter(
            r => 'Submitted' in r.status || 'Approved' in r.status
          );
          if (submittedReports.length > 0) {
            const latestReport = submittedReports[0];
            const votesResult = await VotingService.getReportVotes(
              latestReport.id
            );
            if (votesResult.success && votesResult.votes) {
              setCurrentReportVotes(votesResult.votes);
            }
          }
        }

        if (statsResult) {
          setReportStats(statsResult);
        }

        if (votingStatsResult) {
          setVotingStats(votingStatsResult);
        }

        if (investorsResult && investorsResult.length > 0) {
          setInvestors(investorsResult);
        }
      } catch (err) {
        console.error('Error fetching profit sharing data:', err);
        setError('Failed to load profit sharing data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfitSharingData();
  }, [startupId]);

  const paymentTabs: PaymentTab[] = [
    { label: 'Current payment' },
    { label: 'Payment history' },
    { label: 'Analytics' },
    { label: 'Investor feedback' },
  ];

  // Calculate metrics from real data
  const totalPaid = reportStats
    ? Number(reportStats.totalProfitSharing) / 100
    : 0;
  const paymentsMade = reports.filter(r => 'Approved' in r.status).length;
  const avgApproval = votingStats ? Number(votingStats.averageConfidence) : 0;
  const activeInvestors = investors.length;

  // Get current month's report
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const currentReport = reports.find(
    r => Number(r.month) === currentMonth && Number(r.year) === currentYear
  );

  // Calculate voting statistics for current report
  const approvedVotes = currentReportVotes.filter(
    v => 'Approve' in v.vote
  ).length;
  const rejectedVotes = currentReportVotes.filter(
    v => 'Reject' in v.vote
  ).length;
  const abstainedVotes = currentReportVotes.filter(
    v => 'Abstain' in v.vote
  ).length;
  const totalVotes = currentReportVotes.length;
  const participationRate =
    activeInvestors > 0 ? (totalVotes / activeInvestors) * 100 : 0;

  if (loading) {
    return (
      <Card className='bg-neutral-100'>
        <div className='animate-pulse space-y-6'>
          <div className='grid grid-cols-4 gap-6'>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className='bg-white rounded-lg p-4'>
                <div className='h-8 bg-gray-300 rounded mb-2'></div>
                <div className='h-4 bg-gray-200 rounded'></div>
              </div>
            ))}
          </div>
          <div className='h-64 bg-gray-200 rounded'></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='bg-red-50 border border-red-200'>
        <div className='text-red-600 p-6'>
          <h2 className='text-xl font-semibold mb-2'>
            Error Loading Profit Sharing
          </h2>
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  if (!startupId) {
    return (
      <Card className='bg-neutral-100'>
        <div className='text-center py-12'>
          <h2 className='text-xl font-semibold mb-2'>No Startup Selected</h2>
          <p className='text-gray-500'>
            Please select a startup to view profit sharing details.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className='bg-neutral-100'>
      {/* Summary Cards */}
      <div className='grid grid-cols-4 gap-6 mb-8'>
        <Card className='text-center p-4'>
          <div className='flex items-center justify-center mb-2'>
            <TrendingUp className='w-5 h-5 text-green-500 mr-2' />
          </div>
          <div className='text-2xl font-bold text-gray-900 mb-1'>
            {formatCurrency(totalPaid)}
          </div>
          <div className='text-sm text-gray-500'>Total Paid</div>
        </Card>
        <Card className='text-center p-4'>
          <div className='flex items-center justify-center mb-2'>
            <CheckCircle className='w-5 h-5 text-blue-500 mr-2' />
          </div>
          <div className='text-2xl font-bold text-gray-900 mb-1'>
            {paymentsMade}
          </div>
          <div className='text-sm text-gray-500'>Payments Made</div>
        </Card>
        <Card className='text-center p-4'>
          <div className='flex items-center justify-center mb-2'>
            <Clock className='w-5 h-5 text-purple-500 mr-2' />
          </div>
          <div className='text-2xl font-bold text-gray-900 mb-1'>
            {avgApproval}%
          </div>
          <div className='text-sm text-gray-500'>Avg Approval</div>
        </Card>
        <Card className='text-center p-4'>
          <div className='flex items-center justify-center mb-2'>
            <Users className='w-5 h-5 text-orange-500 mr-2' />
          </div>
          <div className='text-2xl font-bold text-gray-900 mb-1'>
            {activeInvestors}
          </div>
          <div className='text-sm text-gray-500'>Active Investors</div>
        </Card>
      </div>

      {/* Payment Section */}
      <div className='mb-6'>
        {currentReport ? (
          <>
            <h3 className='text-xl font-semibold mb-4'>
              {getMonthName(Number(currentReport.month))}{' '}
              {Number(currentReport.year)} Payment
            </h3>

            {/* Payment Header */}
            <div className='flex justify-between items-start mb-4'>
              <div className='flex gap-8'>
                <div>
                  <div className='text-sm text-gray-500 mb-1'>Amount Due</div>
                  <div className='text-sm font-semibold'>
                    {formatCurrency(
                      Number(currentReport.profitSharingAmount) / 100
                    )}{' '}
                    ckUSDC
                  </div>
                </div>
                <div>
                  <div className='text-sm text-gray-500 mb-1'>Due Date</div>
                  <div className='text-sm font-semibold'>
                    {getPaymentDueDate(
                      Number(currentReport.month),
                      Number(currentReport.year)
                    )}
                  </div>
                </div>
                <div>
                  <div className='text-sm text-gray-500 mb-1'>Status</div>
                  <div className='text-sm font-semibold'>
                    <Badge variant={getStatusVariant(currentReport.status)}>
                      {getStatusText(currentReport.status)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className='flex gap-3'>
                <Button variant='secondary'>
                  <Eye size={16} />
                  View Details
                </Button>
                {('Draft' in currentReport.status ||
                  'Submitted' in currentReport.status) && (
                  <Button variant='primary'>
                    <Plus size={16} />
                    Make payment
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <h3 className='text-xl font-semibold mb-4'>
              {getMonthName(currentMonth)} {currentYear} Payment
            </h3>
            <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4'>
              <p className='text-gray-600'>
                No payment due for this month. Create a monthly report to
                generate profit sharing payments.
              </p>
            </div>
          </>
        )}

        {/* Tabs */}
        <div className='mb-4'>
          <div className='flex border-b border-gray-200'>
            {paymentTabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActivePaymentTab(index)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activePaymentTab === index
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activePaymentTab === 0 && currentReport && (
          <div className='grid grid-cols-2 gap-8'>
            {/* Payment Information */}
            <div>
              <h4 className='text-sm font-semibold mb-4'>
                Payment Information
              </h4>
              <div className='space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-500'>Amount:</span>
                  <span className='font-medium'>
                    {formatCurrency(
                      Number(currentReport.profitSharingAmount) / 100
                    )}{' '}
                    ckUSDC
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-500'>Due Date:</span>
                  <span className='font-medium'>
                    {getPaymentDueDate(
                      Number(currentReport.month),
                      Number(currentReport.year)
                    )}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-500'>Status:</span>
                  <Badge variant={getStatusVariant(currentReport.status)}>
                    {getStatusText(currentReport.status)}
                  </Badge>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-500'>Investors:</span>
                  <span className='font-medium'>
                    {Number(currentReport.investorCount)} active
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-500'>Profit:</span>
                  <span className='font-medium text-green-600'>
                    {formatCurrency(Number(currentReport.profit) / 100)}
                  </span>
                </div>
              </div>
            </div>

            {/* Voting Status */}
            <div>
              <h4 className='text-sm font-semibold mb-4'>Voting status</h4>
              <div className='space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-500'>Approved:</span>
                  <span className='font-medium text-green-600'>
                    {approvedVotes}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-500'>Rejected:</span>
                  <span className='font-medium text-red-600'>
                    {rejectedVotes}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-500'>Abstained:</span>
                  <span className='font-medium text-gray-600'>
                    {abstainedVotes}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-500'>Participation:</span>
                  <span className='font-medium'>
                    {Math.round(participationRate)}%
                  </span>
                </div>
                <div className='mt-4'>
                  <div className='flex justify-between text-xs text-gray-500 mb-1'>
                    <span>Voting Progress</span>
                    <span>
                      {totalVotes}/{activeInvestors} votes
                    </span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                      style={{ width: `${Math.min(100, participationRate)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment History Tab */}
        {activePaymentTab === 1 && (
          <div className='space-y-4'>
            <h4 className='text-sm font-semibold mb-4'>Payment History</h4>
            {reports.filter(r => 'Approved' in r.status).length > 0 ? (
              <div className='space-y-3'>
                {reports
                  .filter(r => 'Approved' in r.status)
                  .sort(
                    (a, b) =>
                      Number(b.year) - Number(a.year) ||
                      Number(b.month) - Number(a.month)
                  )
                  .map(report => (
                    <Card key={report.id} className='p-4'>
                      <div className='flex justify-between items-center'>
                        <div>
                          <h5 className='font-medium'>
                            {getMonthName(Number(report.month))}{' '}
                            {Number(report.year)}
                          </h5>
                          <p className='text-sm text-gray-500'>
                            Paid on{' '}
                            {report.approvedAt
                              ? new Date(
                                  Number(report.approvedAt) / 1000000
                                ).toLocaleDateString()
                              : 'N/A'}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='font-semibold text-green-600'>
                            {formatCurrency(
                              Number(report.profitSharingAmount) / 100
                            )}
                          </p>
                          <p className='text-sm text-gray-500'>
                            {Number(report.investorCount)} investors
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <p className='text-gray-500'>No payment history available</p>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activePaymentTab === 2 && reportStats && (
          <div className='space-y-6'>
            <h4 className='text-sm font-semibold mb-4'>Analytics</h4>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <Card className='p-4 text-center'>
                <div className='text-lg font-semibold text-green-600'>
                  {formatCurrency(Number(reportStats.totalProfitSharing) / 100)}
                </div>
                <div className='text-sm text-gray-500'>
                  Total Profit Sharing
                </div>
              </Card>
              <Card className='p-4 text-center'>
                <div className='text-lg font-semibold text-blue-600'>
                  {formatCurrency(
                    Number(reportStats.averageMonthlyProfit) / 100
                  )}
                </div>
                <div className='text-sm text-gray-500'>Avg Monthly Profit</div>
              </Card>
              <Card className='p-4 text-center'>
                <div className='text-lg font-semibold text-purple-600'>
                  {Number(reportStats.totalReports)}
                </div>
                <div className='text-sm text-gray-500'>Total Reports</div>
              </Card>
              <Card className='p-4 text-center'>
                <div className='text-lg font-semibold text-orange-600'>
                  {reportStats.bestMonth ? reportStats.bestMonth[0] : 'N/A'}
                </div>
                <div className='text-sm text-gray-500'>Best Month</div>
              </Card>
            </div>

            <Card className='p-4'>
              <h5 className='font-medium mb-3'>Profit Sharing Trend</h5>
              <div className='space-y-2'>
                {reports
                  .filter(r => 'Approved' in r.status)
                  .sort(
                    (a, b) =>
                      Number(a.year) - Number(b.year) ||
                      Number(a.month) - Number(b.month)
                  )
                  .slice(-6)
                  .map(report => (
                    <div
                      key={report.id}
                      className='flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0'
                    >
                      <span className='text-sm'>
                        {getMonthName(Number(report.month))}{' '}
                        {Number(report.year)}
                      </span>
                      <span className='font-medium'>
                        {formatCurrency(
                          Number(report.profitSharingAmount) / 100
                        )}
                      </span>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        )}

        {/* Investor Feedback Tab */}
        {activePaymentTab === 3 && (
          <div className='space-y-4'>
            <h4 className='text-sm font-semibold mb-4'>Investor Feedback</h4>
            {currentReportVotes.filter(v => v.feedback && v.feedback[0])
              .length > 0 ? (
              <div className='space-y-3'>
                {currentReportVotes
                  .filter(v => v.feedback && v.feedback[0])
                  .map(vote => (
                    <Card key={vote.id} className='p-4'>
                      <div className='flex justify-between items-start mb-2'>
                        <div className='flex items-center gap-2'>
                          <Badge variant={getVoteVariant(vote.vote)}>
                            {getVoteText(vote.vote)}
                          </Badge>
                          <span className='text-sm text-gray-500'>
                            Confidence: {Number(vote.confidence)}%
                          </span>
                        </div>
                        <span className='text-xs text-gray-400'>
                          {new Date(
                            Number(vote.timestamp) / 1000000
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <p className='text-sm text-gray-700'>
                        {vote.feedback && vote.feedback[0]}
                      </p>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <p className='text-gray-500'>No investor feedback available</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Warning */}
      {currentReport &&
        ('Submitted' in currentReport.status ||
          'Draft' in currentReport.status) && (
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3'>
            <AlertTriangle size={20} className='text-orange-500' />
            <div className='text-sm text-yellow-800'>
              <strong>Payment Pending.</strong> Make your payment by{' '}
              {getPaymentDueDate(
                Number(currentReport.month),
                Number(currentReport.year)
              )}{' '}
              to maintain good standing with investors.
            </div>
          </div>
        )}
    </Card>
  );
}

// Helper functions
function getMonthName(month: number): string {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month - 1] || 'Unknown';
}

function getPaymentDueDate(month: number, year: number): string {
  // Payment is due on the 21st of the following month
  const dueMonth = month === 12 ? 1 : month + 1;
  const dueYear = month === 12 ? year + 1 : year;
  return `${dueMonth}/21/${dueYear}`;
}

function getStatusText(status: any): string {
  if ('Approved' in status) return 'Approved';
  if ('Submitted' in status) return 'Submitted';
  if ('Draft' in status) return 'Draft';
  if ('Rejected' in status) return 'Rejected';
  return 'Unknown';
}

function getStatusVariant(
  status: any
): 'default' | 'secondary' | 'destructive' | 'outline' | 'warning' | 'success' {
  if ('Approved' in status) return 'success';
  if ('Submitted' in status) return 'warning';
  if ('Draft' in status) return 'secondary';
  if ('Rejected' in status) return 'destructive';
  return 'default';
}

function getVoteText(vote: any): string {
  if ('Approve' in vote) return 'Approved';
  if ('Reject' in vote) return 'Rejected';
  if ('Abstain' in vote) return 'Abstained';
  return 'Unknown';
}

function getVoteVariant(
  vote: any
): 'default' | 'secondary' | 'destructive' | 'outline' | 'warning' | 'success' {
  if ('Approve' in vote) return 'success';
  if ('Reject' in vote) return 'destructive';
  if ('Abstain' in vote) return 'secondary';
  return 'default';
}
