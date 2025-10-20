import React, { useState, useEffect, useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { Eye, FileText, ThumbsDown, ThumbsUp, AlertCircle } from 'lucide-react';

import { Button, Badge, Card, LoadingSpinner } from '@/components/ui';
import { InvestorService } from '@/services/investors/InvestorService';
import { VotingService } from '@/services/investors/VotingService';

type VoteTypeVariant = 'approve' | 'reject' | 'abstain';

interface NormalizedVoteType {
  approved?: null;
  rejected?: null;
  abstained?: null;
}

interface NormalizedInvestorVote {
  id: string;
  reportId: string;
  investorId: string;
  voteType: NormalizedVoteType;
  timestamp: bigint;
}

interface Report {
  id: string;
  month: number;
  year: number;
  revenue: number;
  expenses: number;
  profit: number;
  profitSharingAmount: number;
  status: 'Submitted' | 'Approved' | 'Pending';
  investorCount: number;
  createdAt: bigint;
  existingVote?: VoteTypeVariant | null;
}

interface VotingTabProps {
  _onBackToOverview?: () => void;
}

export default function VotingTab({ _onBackToOverview }: VotingTabProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [isVoting, setIsVoting] = useState(false);
  const [_voteHistory, setVoteHistory] = useState<NormalizedInvestorVote[]>([]);
  const [investorId, setInvestorId] = useState<string | null>(null);
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const fetchVotingData = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);

      const investor = await InvestorService.getInvestorByPrincipal();

      if (!investor) {
        setError('Investor not found. Please register as an investor.');
        setLoading(false);
        return;
      }

      setInvestorId(investor.id);

      const result = await VotingService.getInvestorVoteHistory(investor.id);

      if (!result.success || !result.history) {
        setError(result.error || 'Failed to load voting history');
        setLoading(false);
        return;
      }

      // Normalize DFINITY data into JS-friendly objects
      const normalizedVotes: NormalizedInvestorVote[] =
        result.history.votes.map((v: any) => ({
          id: v.id ?? crypto.randomUUID(),
          reportId: v.reportId ?? '',
          investorId: v.investorId ?? '',
          voteType: v.voteType as NormalizedVoteType,
          timestamp: v.timestamp ?? BigInt(Date.now() * 1000000),
        }));

      setVoteHistory(normalizedVotes);

      const mockPendingReports: Report[] = [
        {
          id: 'RPT-2024-001',
          month: 9,
          year: 2024,
          revenue: 12000,
          expenses: 8000,
          profit: 4000,
          profitSharingAmount: 1200,
          status: 'Submitted',
          investorCount: 45,
          createdAt: BigInt(Date.now() * 1000000),
          existingVote: getExistingVote('RPT-2024-001', normalizedVotes),
        },
        {
          id: 'RPT-2024-002',
          month: 8,
          year: 2024,
          revenue: 15000,
          expenses: 9000,
          profit: 6000,
          profitSharingAmount: 2000,
          status: 'Approved',
          investorCount: 60,
          createdAt: BigInt(Date.now() * 1000000),
          existingVote: getExistingVote('RPT-2024-002', normalizedVotes),
        },
      ];

      setPendingReports(mockPendingReports);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching voting data:', err);
      setError('An unexpected error occurred while loading voting data');
      setLoading(false);
    }
  }, []);

  const getExistingVote = (
    reportId: string,
    votes: NormalizedInvestorVote[]
  ): VoteTypeVariant | null => {
    const vote = votes.find(v => v.reportId === reportId);
    if (!vote) return null;

    if (vote.voteType.approved !== undefined) return 'approve';
    if (vote.voteType.rejected !== undefined) return 'reject';
    if (vote.voteType.abstained !== undefined) return 'abstain';
    return null;
  };

  const handleStartupDetails = (startupId: string = 'STARTUP-001') => {
    // Navigate to startup details page
    router.push(`/explore/detail?id=${startupId}`);
  };

  const handleViewFullReport = (report: Report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleVote = async (reportId: string, voteType: VoteTypeVariant) => {
    if (!investorId) {
      alert('Investor ID not found');
      return;
    }

    try {
      setIsVoting(true);

      const canVote = await VotingService.canInvestorVote(reportId);
      if (!canVote) {
        alert('You are not eligible to vote on this report');
        setIsVoting(false);
        return;
      }

      const existingVote =
        await VotingService.getInvestorVoteForReport(reportId);

      const voteTypeVariant =
        voteType === 'approve'
          ? { Approve: null }
          : voteType === 'reject'
            ? { Reject: null }
            : { Abstain: null };

      let result;
      if (existingVote) {
        result = await VotingService.updateVote(reportId, {
          reportId,
          vote: voteTypeVariant,
          feedback: [],
          feedbackType: [],
          confidence: BigInt(100),
        });
      } else {
        result = await VotingService.castVote({
          reportId,
          vote: voteTypeVariant,
          feedback: [],
          feedbackType: [],
          confidence: BigInt(100),
        });
      }

      if (result.success) {
        alert(`Vote ${existingVote ? 'updated' : 'submitted'} successfully!`);
        await fetchVotingData();
      } else {
        alert(
          `Failed to ${existingVote ? 'update' : 'submit'} vote: ${result.error}`
        );
      }
    } catch (error) {
      console.error('Vote error:', error);
      alert('An error occurred while voting');
    } finally {
      setIsVoting(false);
    }
  };

  const formatDate = (timestamp: bigint): string => {
    try {
      const date = new Date(Number(timestamp) / 1000000);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  const getDaysLeft = (createdAt: bigint): number => {
    try {
      const reportDate = new Date(Number(createdAt) / 1000000);
      const dueDate = new Date(reportDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      return Math.ceil(
        (dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    fetchVotingData();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <LoadingSpinner className='mx-auto mb-4' />
          <p className='text-gray-600'>Loading voting data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className='p-8'>
        <div className='text-center flex flex-col items-center justify-center'>
          <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Error Loading Voting Data
          </h3>
          <p className='text-gray-600 mb-4'>{error}</p>
          <Button variant='primary' onClick={fetchVotingData}>
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900'>
          Pending Votes -{' '}
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        {/* <Button
          variant='secondary'
          onClick={fetchVotingData}
          className='text-sm'
        >
          Refresh
        </Button> */}
      </div>

      {pendingReports.length === 0 ? (
        <div className='p-8 bg-neutral-100 rounded-[16px]'>
          <div className='text-center'>
            <FileText className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No Reports Available for Voting
            </h3>
            <p className='text-gray-600'>
              There are currently no monthly reports that require your vote.
            </p>
          </div>
        </div>
      ) : (
        <div className='space-y-6'>
          {pendingReports.map(report => {
            const daysLeft = getDaysLeft(report.createdAt);
            const isVotingClosed = daysLeft <= 0;

            return (
              <div
                key={report.id}
                className='flex flex-col items-start p-4 gap-4 w-full bg-gray-50 rounded-2xl'
              >
                {/* Header */}
                <div className='flex items-center justify-between w-full'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                      <div className='w-4 h-4 bg-green-500 rounded-full'></div>
                    </div>
                    <h3 className='text-xl font-semibold text-gray-900'>
                      GreenFarm Organics
                    </h3>
                  </div>
                  <div className='flex items-center gap-3'>
                    {report.existingVote && (
                      <Badge
                        variant={
                          report.existingVote === 'approve'
                            ? 'success'
                            : report.existingVote === 'reject'
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        You {report.existingVote}d
                      </Badge>
                    )}
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        !isVotingClosed
                          ? 'text-red-600 bg-red-50'
                          : 'text-gray-600 bg-gray-50'
                      }`}
                    >
                      {!isVotingClosed
                        ? `Due in ${daysLeft} days`
                        : 'Voting closed'}
                    </span>
                  </div>
                </div>

                {/* Metrics Grid - First Row */}
                <div className='grid grid-cols-3 gap-12 w-full'>
                  <div className='bg-white rounded-2xl p-4'>
                    <p className='text-sm text-gray-500 mb-2'>Revenue</p>
                    <p className='text-2xl font-bold text-gray-900'>
                      ${report.revenue?.toLocaleString() || '804'}
                    </p>
                  </div>
                  <div className='bg-white rounded-2xl p-4'>
                    <p className='text-sm text-gray-500 mb-2'>Monthly return</p>
                    <p className='text-2xl font-bold text-green-600'>
                      ${report.profitSharingAmount?.toLocaleString() || '67'}
                    </p>
                  </div>
                  <div className='bg-white rounded-2xl p-4'>
                    <p className='text-sm text-gray-500 mb-2'>Total returns</p>
                    <p className='text-2xl font-bold text-blue-600'>$201</p>
                  </div>
                </div>

                {/* Metrics Grid - Second Row */}
                <div className='grid grid-cols-3 gap-12 w-full'>
                  <div className='bg-white rounded-2xl p-4'>
                    <p className='text-sm text-gray-500 mb-2'>Progress</p>
                    <div className='flex items-center gap-2'>
                      <p className='text-2xl font-bold text-gray-900'>85%</p>
                      <div className='flex-1'>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                          <div
                            className='h-2 rounded-full bg-green-500'
                            style={{ width: '85%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='bg-white rounded-2xl p-4'>
                    <p className='text-sm text-gray-500 mb-2'>Status</p>
                    <p className='text-2xl font-bold text-gray-900'>Active</p>
                  </div>
                  <div className='bg-white rounded-2xl p-4'>
                    <p className='text-sm text-gray-500 mb-2'>ROI</p>
                    <p className='text-2xl font-bold text-green-600'>40.2%</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex gap-3 w-full justify-end'>
                  <Button
                    variant='secondary'
                    className='flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    onClick={() => handleStartupDetails('STARTUP-001')}
                  >
                    <Eye className='w-4 h-4' />
                    Startup details
                  </Button>
                  <Button
                    variant='secondary'
                    className='flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    onClick={() => handleViewFullReport(report)}
                  >
                    <FileText className='w-4 h-4' />
                    View full report
                  </Button>
                  <Button
                    variant='secondary'
                    className={`flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 ${
                      report.existingVote === 'reject'
                        ? 'bg-red-100 text-red-700 border-red-300'
                        : ''
                    }`}
                    onClick={() => handleVote(report.id, 'reject')}
                    disabled={isVoting || isVotingClosed}
                  >
                    <ThumbsDown className='w-4 h-4' />
                    Reject report
                  </Button>
                  <Button
                    variant='primary'
                    className={`flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 ${
                      report.existingVote === 'approve' ? 'bg-indigo-700' : ''
                    }`}
                    onClick={() => handleVote(report.id, 'approve')}
                    disabled={isVoting || isVotingClosed}
                  >
                    <ThumbsUp className='w-4 h-4' />
                    Approve report
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && selectedReport && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b border-gray-200'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold text-gray-900'>
                  Monthly Report - {selectedReport.month}/{selectedReport.year}
                </h2>
                <Button
                  variant='secondary'
                  onClick={() => setShowReportModal(false)}
                  className='text-gray-500 hover:text-gray-700'
                >
                  ✕
                </Button>
              </div>
            </div>

            <div className='p-6 space-y-6'>
              {/* Report Header */}
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                  <div className='w-6 h-6 bg-green-500 rounded-full'></div>
                </div>
                <div>
                  <h3 className='text-xl font-semibold text-gray-900'>
                    GreenFarm Organics
                  </h3>
                  <p className='text-gray-600'>Monthly Performance Report</p>
                </div>
              </div>

              {/* Financial Summary */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <Card className='p-4'>
                  <p className='text-sm text-gray-600 mb-1'>Revenue</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    ${selectedReport.revenue?.toLocaleString()}
                  </p>
                </Card>
                <Card className='p-4'>
                  <p className='text-sm text-gray-600 mb-1'>Expenses</p>
                  <p className='text-2xl font-bold text-red-600'>
                    ${selectedReport.expenses?.toLocaleString()}
                  </p>
                </Card>
                <Card className='p-4'>
                  <p className='text-sm text-gray-600 mb-1'>Profit</p>
                  <p className='text-2xl font-bold text-green-600'>
                    ${selectedReport.profit?.toLocaleString()}
                  </p>
                </Card>
                <Card className='p-4'>
                  <p className='text-sm text-gray-600 mb-1'>Profit Sharing</p>
                  <p className='text-2xl font-bold text-blue-600'>
                    ${selectedReport.profitSharingAmount?.toLocaleString()}
                  </p>
                </Card>
              </div>

              {/* Report Details */}
              <div className='space-y-4'>
                <h4 className='text-lg font-semibold text-gray-900'>
                  Report Details
                </h4>

                <div className='bg-gray-50 rounded-lg p-4'>
                  <h5 className='font-medium text-gray-900 mb-2'>
                    Revenue Breakdown
                  </h5>
                  <ul className='space-y-1 text-sm text-gray-600'>
                    <li>• Product Sales: $8,000</li>
                    <li>• Subscription Revenue: $3,000</li>
                    <li>• Other Income: $1,000</li>
                  </ul>
                </div>

                <div className='bg-gray-50 rounded-lg p-4'>
                  <h5 className='font-medium text-gray-900 mb-2'>
                    Expense Breakdown
                  </h5>
                  <ul className='space-y-1 text-sm text-gray-600'>
                    <li>• Operating Costs: $5,000</li>
                    <li>• Marketing: $2,000</li>
                    <li>• Administrative: $1,000</li>
                  </ul>
                </div>

                <div className='bg-gray-50 rounded-lg p-4'>
                  <h5 className='font-medium text-gray-900 mb-2'>
                    Key Metrics
                  </h5>
                  <ul className='space-y-1 text-sm text-gray-600'>
                    <li>• Customer Acquisition: 150 new customers</li>
                    <li>• Retention Rate: 85%</li>
                    <li>• Growth Rate: 12% MoM</li>
                  </ul>
                </div>
              </div>

              {/* Voting Actions */}
              <div className='flex gap-3 pt-4 border-t border-gray-200'>
                <Button
                  variant='secondary'
                  className='flex items-center gap-2'
                  onClick={() => {
                    handleVote(selectedReport.id, 'reject');
                    setShowReportModal(false);
                  }}
                  disabled={isVoting}
                >
                  <ThumbsDown className='w-4 h-4' />
                  Reject Report
                </Button>
                <Button
                  variant='primary'
                  className='flex items-center gap-2'
                  onClick={() => {
                    handleVote(selectedReport.id, 'approve');
                    setShowReportModal(false);
                  }}
                  disabled={isVoting}
                >
                  <ThumbsUp className='w-4 h-4' />
                  Approve Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
