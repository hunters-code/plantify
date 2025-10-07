import { Eye, FileText, ThumbsDown, ThumbsUp } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Button, Badge } from '@/components/ui';

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
  createdAt: number; // nanoseconds (dummy)
  existingVote?: 'approve' | 'reject' | 'abstain' | null;
}

interface VotingTabProps {
  onBackToOverview?: () => void;
}

export default function VotingTab({ onBackToOverview }: VotingTabProps) {
  const [votes, setVotes] = useState<
    Record<string, 'approve' | 'reject' | 'abstain'>
  >({});
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Dummy fetch reports
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const dummyReports: Report[] = [
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
          createdAt: Date.now() * 1000000, // dummy nanoseconds
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
          createdAt: Date.now() * 1000000,
        },
      ];

      setReports(dummyReports);
      setLoading(false);
    }, 1000);
  }, []);

  const handleVote = async (
    reportId: string,
    voteType: 'approve' | 'reject' | 'abstain'
  ) => {
    try {
      setIsLoading(true);

      // dummy "API delay"
      await new Promise(res => setTimeout(res, 500));

      setVotes(prev => ({
        ...prev,
        [reportId]: voteType,
      }));

      alert(`Vote submitted: ${voteType} for report ${reportId}`);
    } catch (error) {
      console.error('Vote error:', error);
      alert('Vote failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='space-y-8'>
        <h2 className='text-2xl font-bold text-gray-900'>
          Loading Voting Items...
        </h2>
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <h2 className='text-2xl font-bold text-gray-900'>
        Pending Votes -{' '}
        {new Date().toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })}
      </h2>

      {/* Voting Items */}
      {reports.length === 0 ? (
        <div className='bg-white rounded-lg border border-gray-200 p-8 text-center'>
          <FileText className='w-12 h-12 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No Reports Available for Voting
          </h3>
          <p className='text-gray-600'>
            There are currently no monthly reports that require your vote.
          </p>
        </div>
      ) : (
        <div className='space-y-6'>
          {reports.map(report => {
            const userVote = votes[report.id];
            const reportDate = new Date(Number(report.createdAt) / 1000000);
            const dueDate = new Date(
              reportDate.getTime() + 7 * 24 * 60 * 60 * 1000
            );
            const daysLeft = Math.ceil(
              (dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={report.id}
                className='bg-white rounded-lg border border-gray-200 p-6'
              >
                <div className='bg-gray-50 rounded-lg p-6'>
                  {/* Header */}
                  <div className='flex items-center justify-between mb-8'>
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                        <div className='w-4 h-4 bg-green-500 rounded-full'></div>
                      </div>
                      <h3 className='text-xl font-semibold text-gray-900'>
                        Monthly Report - {report.month}/{report.year}
                      </h3>
                    </div>
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        daysLeft > 0
                          ? 'text-red-600 bg-red-50'
                          : 'text-gray-600 bg-gray-50'
                      }`}
                    >
                      {daysLeft > 0
                        ? `Due in ${daysLeft} days`
                        : 'Voting closed'}
                    </span>
                  </div>

                  {/* Metrics Grid */}
                  <div className='grid grid-cols-3 gap-12 mb-8'>
                    <div>
                      <p className='text-sm text-gray-500 mb-2'>Revenue</p>
                      <p className='text-2xl font-bold text-gray-900'>
                        ${report.revenue.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className='text-sm text-gray-500 mb-2'>Expenses</p>
                      <p className='text-2xl font-bold text-red-600'>
                        ${report.expenses.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className='text-sm text-gray-500 mb-2'>Profit</p>
                      <p className='text-2xl font-bold text-green-600'>
                        ${report.profit.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className='grid grid-cols-3 gap-12 mb-8'>
                    <div>
                      <p className='text-sm text-gray-500 mb-2'>
                        Profit Sharing
                      </p>
                      <p className='text-2xl font-bold text-blue-600'>
                        ${report.profitSharingAmount.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className='text-sm text-gray-500 mb-2'>Status</p>
                      <Badge
                        variant={
                          report.status === 'Approved' ? 'success' : 'warning'
                        }
                      >
                        {report.status}
                      </Badge>
                    </div>

                    <div>
                      <p className='text-sm text-gray-500 mb-2'>Investors</p>
                      <p className='text-2xl font-bold text-gray-900'>
                        {report.investorCount}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex gap-3'>
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
                      variant={userVote === 'reject' ? 'primary' : 'secondary'}
                      className='flex items-center gap-2'
                      onClick={() => handleVote(report.id, 'reject')}
                      disabled={isLoading || daysLeft <= 0}
                    >
                      <ThumbsDown className='w-4 h-4' />
                      {userVote === 'reject' ? 'Rejected' : 'Reject'}
                    </Button>
                    <Button
                      variant={userVote === 'approve' ? 'primary' : 'primary'}
                      className='flex items-center gap-2'
                      onClick={() => handleVote(report.id, 'approve')}
                      disabled={isLoading || daysLeft <= 0}
                    >
                      <ThumbsUp className='w-4 h-4' />
                      {userVote === 'approve' ? 'Approved' : 'Approve'}
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
