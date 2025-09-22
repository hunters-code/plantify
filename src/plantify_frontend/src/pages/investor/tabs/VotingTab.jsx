import React, { useState, useEffect } from 'react';
import { Eye, FileText, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button, Badge } from '../../../components/ui';
import { useVoting } from '../../../hooks/useVoting';

export default function VotingTab({ onBackToOverview }) {
  const [votes, setVotes] = useState({});
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { castVote, updateVote, getInvestorVoteForReport, getAllMonthlyReports, isLoading } = useVoting();

  // Load monthly reports and existing votes
  useEffect(() => {
    const loadReportsAndVotes = async () => {
      try {
        setLoading(true);
        console.log('Loading monthly reports...');
        
        // Get all monthly reports
        const monthlyReports = await getAllMonthlyReports();
        console.log('Monthly reports:', monthlyReports);
        
        // Filter reports that are submitted and need voting
        const reportsNeedingVotes = monthlyReports.filter(report => 
          report.status === 'Submitted' || report.status === 'Approved'
        );
        
        console.log('Reports needing votes:', reportsNeedingVotes);
        
        // Get existing votes for each report
        const reportsWithVotes = await Promise.all(
          reportsNeedingVotes.map(async (report) => {
            try {
              const existingVote = await getInvestorVoteForReport(report.id);
              return {
                ...report,
                existingVote: existingVote
              };
            } catch (error) {
              console.warn(`Could not get vote for report ${report.id}:`, error);
              return {
                ...report,
                existingVote: null
              };
            }
          })
        );
        
        setReports(reportsWithVotes);
        
        // Set existing votes in local state
        const existingVotes = {};
        reportsWithVotes.forEach(report => {
          if (report.existingVote) {
            // Convert backend vote type to string
            let voteType = 'approve';
            if ('Reject' in report.existingVote.vote) voteType = 'reject';
            else if ('Abstain' in report.existingVote.vote) voteType = 'abstain';
            
            existingVotes[report.id] = voteType;
          }
        });
        setVotes(existingVotes);
        
      } catch (error) {
        console.error('Error loading reports and votes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReportsAndVotes();
  }, []);

  const handleVote = async (reportId, voteType) => {
    try {
      console.log('Handling vote:', { reportId, voteType });
      
      const report = reports.find(r => r.id === reportId);
      if (!report) {
        alert('Report not found');
        return;
      }

      // Prepare vote data
      const voteData = {
        reportId: reportId,
        vote: voteType === 'approve' ? 'Approve' : voteType === 'reject' ? 'Reject' : 'Abstain',
        feedback: null, // Could be extended to include feedback
        feedbackType: null,
        confidence: 8 // Default confidence level
      };

      let result;
      
      // Check if updating existing vote or casting new vote
      if (report.existingVote) {
        result = await updateVote(voteData);
      } else {
        result = await castVote(voteData);
      }

      if (result.success) {
        // Update local state
        setVotes(prev => ({
          ...prev,
          [reportId]: voteType
        }));
        
        alert(result.message);
      } else {
        alert(`Vote failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Vote error:', error);
      alert(`Vote failed: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Loading Voting Items...</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900">
        Pending Votes - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </h2>

      {/* Voting Items */}
      {reports.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Available for Voting</h3>
          <p className="text-gray-600">There are currently no monthly reports that require your vote.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => {
            const userVote = votes[report.id];
            const reportDate = new Date(Number(report.createdAt) / 1000000); // Convert nanoseconds to milliseconds
            const dueDate = new Date(reportDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from creation
            const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Monthly Report - {report.month}/{report.year}
                      </h3>
                    </div>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                      daysLeft > 0 ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-50'
                    }`}>
                      {daysLeft > 0 ? `Due in ${daysLeft} days` : 'Voting closed'}
                    </span>
                  </div>

                  {/* Metrics Grid - First Row */}
                  <div className="grid grid-cols-3 gap-12 mb-8">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${Number(report.revenue).toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Expenses</p>
                      <p className="text-2xl font-bold text-red-600">${Number(report.expenses).toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Profit</p>
                      <p className="text-2xl font-bold text-green-600">${Number(report.profit).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Metrics Grid - Second Row */}
                  <div className="grid grid-cols-3 gap-12 mb-8">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Profit Sharing</p>
                      <p className="text-2xl font-bold text-blue-600">${Number(report.profitSharingAmount).toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Status</p>
                      <Badge variant={report.status === 'Approved' ? 'success' : 'warning'}>
                        {report.status}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Investors</p>
                      <p className="text-2xl font-bold text-gray-900">{Number(report.investorCount)}</p>
                    </div>
                  </div>

                  {/* Action Buttons - Horizontal Layout */}
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Full Report
                    </Button>
                    <Button
                      variant={userVote === 'reject' ? 'primary' : 'secondary'}
                      className="flex items-center gap-2"
                      onClick={() => handleVote(report.id, 'reject')}
                      disabled={isLoading || daysLeft <= 0}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      {userVote === 'reject' ? 'Rejected' : 'Reject'}
                    </Button>
                    <Button
                      variant={userVote === 'approve' ? 'primary' : 'primary'}
                      className="flex items-center gap-2"
                      onClick={() => handleVote(report.id, 'approve')}
                      disabled={isLoading || daysLeft <= 0}
                    >
                      <ThumbsUp className="w-4 h-4" />
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