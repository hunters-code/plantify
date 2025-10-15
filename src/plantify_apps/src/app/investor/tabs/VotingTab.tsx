import { Eye, FileText, ThumbsDown, ThumbsUp, AlertCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Button, Badge, Card, LoadingSpinner } from '@/components/ui';
import { VotingService } from '@/services/investors/VotingService';
import { InvestorService } from '@/services/investors/InvestorService';

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
  onBackToOverview?: () => void;
}

export default function VotingTab({ onBackToOverview }: VotingTabProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [isVoting, setIsVoting] = useState(false);
  const [voteHistory, setVoteHistory] = useState<NormalizedInvestorVote[]>([]);
  const [investorId, setInvestorId] = useState<string | null>(null);
  const [pendingReports, setPendingReports] = useState<Report[]>([]);

  const fetchVotingData = async () => {
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
  };

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
        <Button
          variant='secondary'
          onClick={fetchVotingData}
          className='text-sm'
        >
          Refresh
        </Button>
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
                className='bg-neutral-100 rounded-[16px] border border-gray-200 p-6'
              >
                <div className='p-6'>
                  <div className='flex items-center justify-between mb-8'>
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                        <div className='w-4 h-4 bg-green-500 rounded-full'></div>
                      </div>
                      <h3 className='text-xl font-semibold text-gray-900'>
                        Monthly Report - {report.month}/{report.year}
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
                            : 'text-gray-600 bg-white'
                        }`}
                      >
                        {!isVotingClosed
                          ? `Due in ${daysLeft} days`
                          : 'Voting closed'}
                      </span>
                    </div>
                  </div>

                  <div className='grid grid-cols-3 gap-4 mb-8'>
                    <div className='bg-white rounded-[16px] p-4'>
                      <p className='text-sm text-gray-500 mb-2'>Revenue</p>
                      <p className='text-2xl font-bold text-gray-900'>
                        ${report.revenue.toLocaleString()}
                      </p>
                    </div>

                    <div className='bg-white rounded-[16px] p-4'>
                      <p className='text-sm text-gray-500 mb-2'>Expenses</p>
                      <p className='text-2xl font-bold text-red-600'>
                        ${report.expenses.toLocaleString()}
                      </p>
                    </div>

                    <div className='bg-white rounded-[16px] p-4'>
                      <p className='text-sm text-gray-500 mb-2'>Profit</p>
                      <p className='text-2xl font-bold text-green-600'>
                        ${report.profit.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className='grid grid-cols-3 gap-4 mb-8'>
                    <div className='bg-white rounded-[16px] p-4'>
                      <p className='text-sm text-gray-500 mb-2'>
                        Profit Sharing
                      </p>
                      <p className='text-2xl font-bold text-blue-600'>
                        ${report.profitSharingAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className='bg-white rounded-[16px] p-4'>
                      <p className='text-sm text-gray-500 mb-2'>Status</p>
                      <Badge
                        variant={
                          report.status === 'Approved' ? 'success' : 'warning'
                        }
                      >
                        {report.status}
                      </Badge>
                    </div>

                    <div className='bg-white rounded-[16px] p-4'>
                      <p className='text-sm text-gray-500 mb-2'>Investors</p>
                      <p className='text-2xl font-bold text-gray-900'>
                        {report.investorCount}
                      </p>
                    </div>
                  </div>

                  <div className='flex gap-3 justify-end'>
                    <Button
                      variant='secondary'
                      className='flex items-center gap-2'
                    >
                      <Eye className='w-4 h-4' />
                      View Details
                    </Button>
                    <Button
                      variant='secondary'
                      className='flex items-center gap-2'
                    >
                      <FileText className='w-4 h-4' />
                      Full Report
                    </Button>
                    <Button
                      variant='secondary'
                      className={`flex items-center gap-2 ${report.existingVote === 'reject' ? 'bg-red-100 text-red-700' : ''}`}
                      onClick={() => handleVote(report.id, 'reject')}
                      disabled={isVoting || isVotingClosed}
                    >
                      <ThumbsDown className='w-4 h-4' />
                      {report.existingVote === 'reject' ? 'Rejected' : 'Reject'}
                    </Button>
                    <Button
                      variant={
                        report.existingVote === 'approve'
                          ? 'primary'
                          : 'primary'
                      }
                      className='flex items-center gap-2'
                      onClick={() => handleVote(report.id, 'approve')}
                      disabled={isVoting || isVotingClosed}
                    >
                      <ThumbsUp className='w-4 h-4' />
                      {report.existingVote === 'approve'
                        ? 'Approved'
                        : 'Approve'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
