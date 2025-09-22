import { useState, useEffect } from 'react';
import { backendService } from '../lib/backend';

export function useMonthlyReports(startupId) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!startupId) {
      setReports([]);
      setLoading(false);
      return;
    }

    const fetchMonthlyReports = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await backendService.getMonthlyReportsByStartup(startupId);
        
        if ('ok' in result) {
          setReports(result.ok.reports || []);
        } else {
          setError(result.err || 'Failed to fetch monthly reports');
          setReports([]);
        }
      } catch (error) {
        console.error('Error fetching monthly reports:', error);
        setError(error.message || 'Failed to fetch monthly reports');
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyReports();
  }, [startupId]);

  const submitReport = async (reportData) => {
    try {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1; // 1-12
      const year = currentDate.getFullYear();

      const request = {
        startupId: startupId,
        month: month,
        year: year,
        revenue: Number(reportData.monthlyRevenue) || 0,
        expenses: Number(reportData.monthlyExpenses) || 0,
        profit: Number(reportData.netProfit) || 0,
        profitSharingAmount: Number(reportData.profitSharingAmount) || 0,
        investorCount: Number(reportData.investorCount) || 0,
        newInvestors: Number(reportData.newInvestors) || 0,
      };

      const result = await backendService.createMonthlyReport(request);
      
      if ('ok' in result) {
        const newReport = result.ok;
        setReports(prev => [newReport, ...prev]);
        
        // Submit the report for approval
        const submitResult = await backendService.submitMonthlyReport(newReport.id);
        if ('ok' in submitResult) {
          setReports(prev => prev.map(r => r.id === newReport.id ? submitResult.ok : r));
          return { success: true, report: submitResult.ok };
        } else {
          return { success: false, error: submitResult.err };
        }
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      return { success: false, error: error.message };
    }
  };

  const saveDraft = async (reportData) => {
    try {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1; // 1-12
      const year = currentDate.getFullYear();

      const request = {
        startupId: startupId,
        month: month,
        year: year,
        revenue: Number(reportData.monthlyRevenue) || 0,
        expenses: Number(reportData.monthlyExpenses) || 0,
        profit: Number(reportData.netProfit) || 0,
        profitSharingAmount: Number(reportData.profitSharingAmount) || 0,
        investorCount: Number(reportData.investorCount) || 0,
        newInvestors: Number(reportData.newInvestors) || 0,
      };

      const result = await backendService.createMonthlyReport(request);
      
      if ('ok' in result) {
        const newReport = result.ok;
        setReports(prev => [newReport, ...prev]);
        return { success: true, report: newReport };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      return { success: false, error: error.message };
    }
  };

  return { reports, loading, error, submitReport, saveDraft };
}
