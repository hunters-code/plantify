import { useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/plantify_backend/plantify_backend.did.js';
import { useAuth } from './useAuth';

// Use IC mainnet canister ID
const PLANTIFY_BACKEND_CANISTER_ID = 'a5ptu-ryaaa-aaaai-q32cq-cai';

// Create actor for IC mainnet
const createBackendActor = () => {
  const agent = new HttpAgent({
    host: 'https://ic0.app',
  });
  
  return Actor.createActor(idlFactory, {
    agent,
    canisterId: PLANTIFY_BACKEND_CANISTER_ID,
  });
};

export const useVoting = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, principal } = useAuth();

  // Cast a vote on a monthly report
  const castVote = async ({ reportId, vote, feedback, feedbackType, confidence }) => {
    if (!isAuthenticated || !principal) {
      throw new Error('User must be authenticated to vote');
    }

    if (!reportId) {
      throw new Error('Report ID is required');
    }

    if (!vote) {
      throw new Error('Vote is required');
    }

    if (!confidence || confidence < 1 || confidence > 10) {
      throw new Error('Confidence must be between 1 and 10');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Casting vote:', { reportId, vote, feedback, feedbackType, confidence, principal: principal.toString() });

      // Create backend actor for IC mainnet
      const plantify_backend = createBackendActor();

      // Create the vote request object
      const voteRequest = {
        reportId: reportId,
        vote: { [vote]: null }, // Convert string to variant: "Approve" -> { Approve: null }
        feedback: feedback ? [feedback] : [], // Optional text as array for Motoko
        feedbackType: feedbackType ? [{ [feedbackType]: null }] : [], // Optional variant
        confidence: BigInt(confidence)
      };

      console.log('Vote request:', voteRequest);

      // Call the backend to cast vote
      const result = await plantify_backend.castVote(voteRequest);

      console.log('Vote result:', result);

      if ('ok' in result) {
        return {
          success: true,
          data: result.ok,
          message: `Successfully cast ${vote.toLowerCase()} vote on report ${reportId}`
        };
      } else {
        const errorMessage = result.err || 'Failed to cast vote';
        console.error('Backend error:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Voting error:', err);
      let errorMessage = err.message || 'Failed to cast vote';
      
      // Provide more user-friendly error messages
      if (errorMessage.includes('already voted')) {
        errorMessage = 'You have already voted on this report. You can update your existing vote instead.';
      } else if (errorMessage.includes('Only investors can vote')) {
        errorMessage = 'Only registered investors can vote on monthly reports.';
      } else if (errorMessage.includes('Report not found')) {
        errorMessage = 'The monthly report could not be found.';
      }
      
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing vote
  const updateVote = async ({ reportId, vote, feedback, feedbackType, confidence }) => {
    if (!isAuthenticated || !principal) {
      throw new Error('User must be authenticated to update vote');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Updating vote:', { reportId, vote, feedback, feedbackType, confidence });

      // Create backend actor for IC mainnet
      const plantify_backend = createBackendActor();

      // Create the vote request object
      const voteRequest = {
        reportId: reportId,
        vote: { [vote]: null },
        feedback: feedback ? [feedback] : [],
        feedbackType: feedbackType ? [{ [feedbackType]: null }] : [],
        confidence: BigInt(confidence)
      };

      // Call the backend to update vote
      const result = await plantify_backend.updateVote(reportId, voteRequest);

      console.log('Update vote result:', result);

      if ('ok' in result) {
        return {
          success: true,
          data: result.ok,
          message: `Successfully updated vote on report ${reportId}`
        };
      } else {
        const errorMessage = result.err || 'Failed to update vote';
        console.error('Backend error:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Vote update error:', err);
      const errorMessage = err.message || 'Failed to update vote';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Get vote summary for a report
  const getVoteSummary = async (reportId) => {
    try {
      console.log('Getting vote summary for report:', reportId);

      // Create backend actor for IC mainnet
      const plantify_backend = createBackendActor();

      // Get vote summary
      const result = await plantify_backend.getVoteSummary(reportId);
      
      if ('ok' in result) {
        return result.ok;
      } else {
        throw new Error(result.err);
      }
    } catch (err) {
      console.error('Error getting vote summary:', err);
      throw err;
    }
  };

  // Get investor's vote for a specific report
  const getInvestorVoteForReport = async (reportId) => {
    try {
      console.log('Getting investor vote for report:', reportId);

      // Create backend actor for IC mainnet
      const plantify_backend = createBackendActor();

      // Get investor vote
      const result = await plantify_backend.getInvestorVoteForReport(reportId);
      
      if ('ok' in result) {
        return result.ok; // This will be null if no vote exists, or the vote object
      } else {
        throw new Error(result.err);
      }
    } catch (err) {
      console.error('Error getting investor vote:', err);
      throw err;
    }
  };

  // Get all monthly reports for voting
  const getAllMonthlyReports = async () => {
    try {
      console.log('Getting all monthly reports');

      // Create backend actor for IC mainnet
      const plantify_backend = createBackendActor();

      // Get all monthly reports
      const reports = await plantify_backend.getAllMonthlyReports();
      
      return reports;
    } catch (err) {
      console.error('Error getting monthly reports:', err);
      throw err;
    }
  };

  // Get report vote details (summary + individual votes)
  const getReportVoteDetails = async (reportId) => {
    try {
      console.log('Getting report vote details:', reportId);

      // Create backend actor for IC mainnet
      const plantify_backend = createBackendActor();

      // Get report vote details
      const result = await plantify_backend.getReportVoteDetails(reportId);
      
      if ('ok' in result) {
        return result.ok;
      } else {
        throw new Error(result.err);
      }
    } catch (err) {
      console.error('Error getting report vote details:', err);
      throw err;
    }
  };

  return {
    castVote,
    updateVote,
    getVoteSummary,
    getInvestorVoteForReport,
    getAllMonthlyReports,
    getReportVoteDetails,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};