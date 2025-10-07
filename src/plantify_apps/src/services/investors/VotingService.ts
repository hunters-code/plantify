import type {
  VoteRequest,
  InvestorVote,
  VoteSummary,
  VotingStats,
  InvestorVoteHistory,
  ReportVoteDetails,
  Result,
  Result_9,
  Result_11,
  Result_19,
  Result_20,
  Result_24,
} from '@/declarations/plantify_backend/plantify_backend.did';

import { BaseService } from '../BaseService';

/**
 * Service for voting-related operations
 */
export class VotingService extends BaseService {
  /**
   * Cast a vote on a monthly report
   * @param request - The vote request
   * @returns The vote or error message
   */
  public static async castVote(request: VoteRequest): Promise<{ success: boolean; vote?: InvestorVote; error?: string }> {
    try {
      const result: Result = await this.getActor().castVote(request);

      if ('ok' in result) {
        return { success: true, vote: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error casting vote:', error);
      return { success: false, error: 'Failed to cast vote' };
    }
  }

  /**
   * Update an existing vote
   * @param reportId - The ID of the report
   * @param request - The updated vote request
   * @returns The updated vote or error message
   */
  public static async updateVote(reportId: string, request: VoteRequest): Promise<{ success: boolean; vote?: InvestorVote; error?: string }> {
    try {
      const result: Result = await this.getActor().updateVote(reportId, request);

      if ('ok' in result) {
        return { success: true, vote: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error updating vote:', error);
      return { success: false, error: 'Failed to update vote' };
    }
  }

  /**
   * Check if an investor can vote on a report
   * @param reportId - The ID of the report
   * @returns True if the investor can vote, false otherwise
   */
  public static async canInvestorVote(reportId: string): Promise<boolean> {
    try {
      const result: Result_24 = await this.getActor().canInvestorVote(reportId);
      return 'ok' in result ? result.ok : false;
    } catch (error) {
      console.error('Error checking if investor can vote:', error);
      return false;
    }
  }

  /**
   * Get the investor's vote for a specific report
   * @param reportId - The ID of the report
   * @returns The vote or null if not found
   */
  public static async getInvestorVoteForReport(reportId: string): Promise<InvestorVote | null> {
    try {
      const result: Result_20 = await this.getActor().getInvestorVoteForReport(reportId);

      if ('ok' in result) {
        return result.ok.length ? result.ok[0] : null;
      } else {
        console.error('Error getting investor vote:', result.err);
        return null;
      }
    } catch (error) {
      console.error('Error getting investor vote for report:', error);
      return null;
    }
  }

  /**
   * Get the voting history for an investor
   * @param investorId - The ID of the investor
   * @returns The voting history or error message
   */
  public static async getInvestorVoteHistory(investorId: string): Promise<{ success: boolean; history?: InvestorVoteHistory; error?: string }> {
    try {
      const result: Result_19 = await this.getActor().getInvestorVoteHistory(investorId);

      if ('ok' in result) {
        return { success: true, history: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error getting investor vote history:', error);
      return { success: false, error: 'Failed to get vote history' };
    }
  }

  /**
   * Get the vote summary for a report
   * @param reportId - The ID of the report
   * @returns The vote summary or error message
   */
  public static async getVoteSummary(reportId: string): Promise<{ success: boolean; summary?: VoteSummary; error?: string }> {
    try {
      const result: Result_9 = await this.getActor().getVoteSummary(reportId);

      if ('ok' in result) {
        return { success: true, summary: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error getting vote summary:', error);
      return { success: false, error: 'Failed to get vote summary' };
    }
  }

  /**
   * Get detailed vote information for a report
   * @param reportId - The ID of the report
   * @returns The vote details or error message
   */
  public static async getReportVoteDetails(reportId: string): Promise<{ success: boolean; details?: ReportVoteDetails; error?: string }> {
    try {
      const result: Result_11 = await this.getActor().getReportVoteDetails(reportId);

      if ('ok' in result) {
        return { success: true, details: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error getting report vote details:', error);
      return { success: false, error: 'Failed to get vote details' };
    }
  }

  /**
   * Get voting statistics
   * @returns Voting statistics
   */
  public static async getVotingStats(): Promise<VotingStats | null> {
    try {
      return await this.getActor().getVotingStats();
    } catch (error) {
      console.error('Error getting voting stats:', error);
      return null;
    }
  }
}
