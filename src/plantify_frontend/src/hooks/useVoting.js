import { useState, useEffect } from 'react';
import { backendService } from '../lib/backend';

export function useVoting(reportId) {
  const [voteSummary, setVoteSummary] = useState(null);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canVote, setCanVote] = useState(false);

  useEffect(() => {
    if (!reportId) {
      setVoteSummary(null);
      setVotes([]);
      setLoading(false);
      return;
    }

    const fetchVotingData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch vote summary and individual votes in parallel
        const [summaryResult, votesResult, canVoteResult] = await Promise.all([
          backendService.getVoteSummary(reportId),
          backendService.getReportVotes(reportId),
          backendService.canInvestorVote(reportId)
        ]);

        if ('ok' in summaryResult) {
          setVoteSummary(summaryResult.ok);
        } else {
          setError(summaryResult.err || 'Failed to fetch vote summary');
        }

        setVotes(votesResult || []);

        if ('ok' in canVoteResult) {
          setCanVote(canVoteResult.ok);
        }
      } catch (error) {
        console.error('Error fetching voting data:', error);
        setError(error.message || 'Failed to fetch voting data');
      } finally {
        setLoading(false);
      }
    };

    fetchVotingData();
  }, [reportId]);

  const castVote = async (voteData) => {
    try {
      const request = {
        reportId: reportId,
        vote: voteData.vote, // 'Approve', 'Reject', or 'Abstain'
        feedback: voteData.feedback || null,
        feedbackType: voteData.feedbackType || null,
        confidence: voteData.confidence || 5, // 1-10 scale
      };

      const result = await backendService.castVote(request);
      
      if ('ok' in result) {
        // Refresh voting data after successful vote
        const [summaryResult, votesResult] = await Promise.all([
          backendService.getVoteSummary(reportId),
          backendService.getReportVotes(reportId)
        ]);

        if ('ok' in summaryResult) {
          setVoteSummary(summaryResult.ok);
        }
        setVotes(votesResult || []);
        setCanVote(false); // Can't vote again after casting

        return { success: true, vote: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error casting vote:', error);
      return { success: false, error: error.message };
    }
  };

  const updateVote = async (voteData) => {
    try {
      const request = {
        reportId: reportId,
        vote: voteData.vote,
        feedback: voteData.feedback || null,
        feedbackType: voteData.feedbackType || null,
        confidence: voteData.confidence || 5,
      };

      const result = await backendService.updateVote(reportId, request);
      
      if ('ok' in result) {
        // Refresh voting data after successful update
        const [summaryResult, votesResult] = await Promise.all([
          backendService.getVoteSummary(reportId),
          backendService.getReportVotes(reportId)
        ]);

        if ('ok' in summaryResult) {
          setVoteSummary(summaryResult.ok);
        }
        setVotes(votesResult || []);

        return { success: true, vote: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error updating vote:', error);
      return { success: false, error: error.message };
    }
  };

  return { 
    voteSummary, 
    votes, 
    loading, 
    error, 
    canVote, 
    castVote, 
    updateVote 
  };
}

export function useVotingStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVotingStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await backendService.getVotingStats();
        setStats(result);
      } catch (error) {
        console.error('Error fetching voting stats:', error);
        setError(error.message || 'Failed to fetch voting statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchVotingStats();
  }, []);

  return { stats, loading, error };
}
