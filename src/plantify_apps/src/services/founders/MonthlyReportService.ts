import type {
  MonthlyReport,
  MonthlyReportRequest,
  MonthlyReportList,
  MonthlyReportStats,
  MonthlyReportStatus,
  Result_1,
  Result_18,
} from '@/declarations/plantify_backend/plantify_backend.did';

import { BaseService } from '../BaseService';

/**
 * Service for monthly report operations
 */
export class MonthlyReportService extends BaseService {
  /**
   * Create a new monthly report
   * @param request - The monthly report request
   * @returns The created report or error message
   */
  public static async createMonthlyReport(
    request: MonthlyReportRequest
  ): Promise<{ success: boolean; report?: MonthlyReport; error?: string }> {
    try {
      const result: Result_1 =
        await this.getActor().createMonthlyReport(request);

      if ('ok' in result) {
        return { success: true, report: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error creating monthly report:', error);
      return { success: false, error: 'Failed to create monthly report' };
    }
  }

  /**
   * Update an existing monthly report
   * @param reportId - The ID of the report to update
   * @param request - The updated report data
   * @returns The updated report or error message
   */
  public static async updateMonthlyReport(
    reportId: string,
    request: MonthlyReportRequest
  ): Promise<{ success: boolean; report?: MonthlyReport; error?: string }> {
    try {
      const result: Result_1 = await this.getActor().updateMonthlyReport(
        reportId,
        request
      );

      if ('ok' in result) {
        return { success: true, report: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error updating monthly report:', error);
      return { success: false, error: 'Failed to update monthly report' };
    }
  }

  /**
   * Submit a monthly report for investor review
   * @param reportId - The ID of the report to submit
   * @returns The submitted report or error message
   */
  public static async submitMonthlyReport(
    reportId: string
  ): Promise<{ success: boolean; report?: MonthlyReport; error?: string }> {
    try {
      const result: Result_1 =
        await this.getActor().submitMonthlyReport(reportId);

      if ('ok' in result) {
        return { success: true, report: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error submitting monthly report:', error);
      return { success: false, error: 'Failed to submit monthly report' };
    }
  }

  /**
   * Get a specific monthly report by ID
   * @param reportId - The ID of the report
   * @returns The monthly report or error message
   */
  public static async getMonthlyReport(
    reportId: string
  ): Promise<{ success: boolean; report?: MonthlyReport; error?: string }> {
    try {
      const result: Result_1 = await this.getActor().getMonthlyReport(reportId);

      if ('ok' in result) {
        return { success: true, report: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error getting monthly report:', error);
      return { success: false, error: 'Failed to get monthly report' };
    }
  }

  /**
   * Get all monthly reports for a specific startup
   * @param startupId - The ID of the startup
   * @returns List of monthly reports or error message
   */
  public static async getMonthlyReportsByStartup(startupId: string): Promise<{
    success: boolean;
    reportList?: MonthlyReportList;
    error?: string;
  }> {
    try {
      const result: Result_18 =
        await this.getActor().getMonthlyReportsByStartup(startupId);

      if ('ok' in result) {
        return { success: true, reportList: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error getting monthly reports by startup:', error);
      return { success: false, error: 'Failed to get monthly reports' };
    }
  }

  /**
   * Get monthly reports by status
   * @param status - The status to filter by
   * @returns Array of monthly reports
   */
  public static async getMonthlyReportsByStatus(
    status: MonthlyReportStatus
  ): Promise<MonthlyReport[]> {
    try {
      return await this.getActor().getMonthlyReportsByStatus(status);
    } catch (error) {
      console.error('Error getting monthly reports by status:', error);
      return [];
    }
  }

  /**
   * Get monthly report statistics
   * @returns Monthly report statistics
   */
  public static async getMonthlyReportStats(): Promise<MonthlyReportStats | null> {
    try {
      return await this.getActor().getMonthlyReportStats();
    } catch (error) {
      console.error('Error getting monthly report stats:', error);
      return null;
    }
  }
}
