'use client';

import { FileText, Plus, X, CheckCircle, Clock, Eye, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Alert, Button, Card, Input } from '@/components/ui';
import type {
  MonthlyReport,
  MonthlyReportRequest,
  MonthlyReportList,
  MonthlyReportStatus,
} from '@/declarations/plantify_backend/plantify_backend.did';
import { MonthlyReportService } from '@/services/founders/MonthlyReportService';
import { formatCurrency } from '@/utils/formatCurrency';

type FormData = {
  monthlyRevenue: string;
  monthlyExpenses: string;
  netProfit: string;
  profitSharingAmount: string;
  investorCount: string;
  newInvestors: string;
};

// Hasil API success/error
type ApiResult = { success: true } | { success: false; error: string };

// Type guard error
function isErrorWithMessage(err: unknown): err is { message: string } {
  return typeof err === 'object' && err !== null && 'message' in err;
}

function useMonthlyReports(startupId: string) {
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      if (!startupId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('Fetching monthly reports for startup:', startupId);
        const result =
          await MonthlyReportService.getMonthlyReportsByStartup(startupId);

        if (result.success && result.reportList) {
          setReports(result.reportList.reports);
          console.log('Monthly reports loaded:', result.reportList.reports);
        } else {
          setError(result.error || 'Failed to load reports');
        }
      } catch (err) {
        console.error('Error fetching monthly reports:', err);
        setError('Failed to load monthly reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [startupId]);

  const submitReport = async (form: FormData): Promise<ApiResult> => {
    try {
      console.log('Creating and submitting report...', form);

      // First create the report
      const reportRequest: MonthlyReportRequest = {
        startupId,
        month: BigInt(new Date().getMonth() + 1),
        year: BigInt(new Date().getFullYear()),
        revenue: BigInt(Math.round(Number(form.monthlyRevenue) * 100)), // Convert to cents
        expenses: BigInt(Math.round(Number(form.monthlyExpenses) * 100)),
        profit: BigInt(Math.round(Number(form.netProfit) * 100)),
        profitSharingAmount: BigInt(
          Math.round(Number(form.profitSharingAmount) * 100)
        ),
        investorCount: BigInt(Number(form.investorCount)),
        newInvestors: BigInt(Number(form.newInvestors)),
      };

      const createResult =
        await MonthlyReportService.createMonthlyReport(reportRequest);

      if (createResult.success && createResult.report) {
        // Then submit the created report
        const submitResult = await MonthlyReportService.submitMonthlyReport(
          createResult.report.id
        );

        if (submitResult.success) {
          // Refresh reports list
          const refreshResult =
            await MonthlyReportService.getMonthlyReportsByStartup(startupId);
          if (refreshResult.success && refreshResult.reportList) {
            setReports(refreshResult.reportList.reports);
          }
          return { success: true };
        } else {
          return {
            success: false,
            error: submitResult.error || 'Failed to submit report',
          };
        }
      } else {
        return {
          success: false,
          error: createResult.error || 'Failed to create report',
        };
      }
    } catch (err) {
      console.error('Error submitting report:', err);
      return { success: false, error: 'Failed to submit report' };
    }
  };

  const saveDraft = async (form: FormData): Promise<ApiResult> => {
    try {
      console.log('Saving draft...', form);

      const reportRequest: MonthlyReportRequest = {
        startupId,
        month: BigInt(new Date().getMonth() + 1),
        year: BigInt(new Date().getFullYear()),
        revenue: BigInt(Math.round(Number(form.monthlyRevenue) * 100)),
        expenses: BigInt(Math.round(Number(form.monthlyExpenses) * 100)),
        profit: BigInt(Math.round(Number(form.netProfit) * 100)),
        profitSharingAmount: BigInt(
          Math.round(Number(form.profitSharingAmount) * 100)
        ),
        investorCount: BigInt(Number(form.investorCount)),
        newInvestors: BigInt(Number(form.newInvestors)),
      };

      const result =
        await MonthlyReportService.createMonthlyReport(reportRequest);

      if (result.success) {
        // Refresh reports list
        const refreshResult =
          await MonthlyReportService.getMonthlyReportsByStartup(startupId);
        if (refreshResult.success && refreshResult.reportList) {
          setReports(refreshResult.reportList.reports);
        }
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to save draft',
        };
      }
    } catch (err) {
      console.error('Error saving draft:', err);
      return { success: false, error: 'Failed to save draft' };
    }
  };

  return { reports, loading, error, submitReport, saveDraft };
}

export default function MonthlyReports({ startupId }: { startupId?: string }) {
  const { reports, loading, error, submitReport, saveDraft } =
    useMonthlyReports(startupId || '');
  const [activeSubTab, setActiveSubTab] = useState<number>(0);
  const [showReportForm, setShowReportForm] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    monthlyRevenue: '',
    monthlyExpenses: '',
    netProfit: '',
    profitSharingAmount: '',
    investorCount: '',
    newInvestors: '',
  });

  const subTabs = [
    { label: 'Current month', id: 0 },
    { label: 'History', id: 1 },
    { label: 'Templates', id: 2 },
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage('');

    try {
      const result = await submitReport(formData);
      if (result.success) {
        setSubmitMessage('Report submitted successfully!');
        setFormData({
          monthlyRevenue: '',
          monthlyExpenses: '',
          netProfit: '',
          profitSharingAmount: '',
          investorCount: '',
          newInvestors: '',
        });
        setShowReportForm(false);
      } else {
        setSubmitMessage(`Error: ${result.error}`);
      }
    } catch (err: unknown) {
      if (isErrorWithMessage(err)) {
        setSubmitMessage(`Error: ${err.message}`);
      } else {
        setSubmitMessage('An unexpected error occurred');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setSubmitting(true);
    setSubmitMessage('');

    try {
      const result = await saveDraft(formData);
      if (result.success) {
        setSubmitMessage('Draft saved successfully!');
        setFormData({
          monthlyRevenue: '',
          monthlyExpenses: '',
          netProfit: '',
          profitSharingAmount: '',
          investorCount: '',
          newInvestors: '',
        });
        setShowReportForm(false);
      } else {
        setSubmitMessage(`Error: ${result.error}`);
      }
    } catch (err: unknown) {
      if (isErrorWithMessage(err)) {
        setSubmitMessage(`Error: ${err.message}`);
      } else {
        setSubmitMessage('An unexpected error occurred');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: MonthlyReportStatus) => {
    if ('Approved' in status) {
      return <CheckCircle className='w-4 h-4 text-green-500' />;
    } else if ('Submitted' in status) {
      return <Clock className='w-4 h-4 text-yellow-500' />;
    } else if ('Draft' in status) {
      return <Edit className='w-4 h-4 text-gray-500' />;
    } else if ('Rejected' in status) {
      return <X className='w-4 h-4 text-red-500' />;
    } else {
      return <Clock className='w-4 h-4 text-gray-500' />;
    }
  };

  const getStatusColor = (status: MonthlyReportStatus) => {
    if ('Approved' in status) {
      return 'bg-green-100 text-green-800';
    } else if ('Submitted' in status) {
      return 'bg-yellow-100 text-yellow-800';
    } else if ('Draft' in status) {
      return 'bg-gray-100 text-gray-800';
    } else if ('Rejected' in status) {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: MonthlyReportStatus) => {
    if ('Approved' in status) return 'Approved';
    if ('Submitted' in status) return 'Submitted';
    if ('Draft' in status) return 'Draft';
    if ('Rejected' in status) return 'Rejected';
    return 'Unknown';
  };

  const getMonthName = (monthNumber: number) => {
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
    return months[monthNumber - 1] || 'Unknown';
  };

  // Skeleton loader
  const SkeletonCard = () => (
    <Card className='p-6 animate-pulse'>
      <div className='h-4 w-32 bg-gray-300 rounded mb-4'></div>
      <div className='h-3 w-24 bg-gray-200 rounded mb-2'></div>
      <div className='h-3 w-40 bg-gray-200 rounded mb-2'></div>
      <div className='h-3 w-20 bg-gray-200 rounded mb-4'></div>
      <div className='h-8 w-24 bg-gray-300 rounded'></div>
    </Card>
  );

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 0:
        return (
          <Card>
            {!showReportForm ? (
              <div className='flex flex-col items-center justify-center py-16 px-8'>
                <div className='w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-6'>
                  <FileText size={48} className='text-gray-400' />
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  {getMonthName(new Date().getMonth() + 1)}{' '}
                  {new Date().getFullYear()} Report
                </h3>
                <p className='text-gray-600 mb-4'>
                  Due:{' '}
                  {new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() + 1,
                    10
                  ).toLocaleDateString()}
                </p>
                <Button
                  onClick={() => setShowReportForm(true)}
                  variant='primary'
                >
                  <Plus size={16} />
                  Start new report
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-6 p-6'>
                {submitMessage && (
                  <Alert
                    type={submitMessage.includes('Error') ? 'error' : 'success'}
                    message={submitMessage}
                  />
                )}

                <Input
                  type='number'
                  label='Monthly Revenue'
                  value={formData.monthlyRevenue}
                  onChange={e =>
                    handleInputChange('monthlyRevenue', e.target.value)
                  }
                />

                <div className='flex justify-end gap-4'>
                  <Button
                    type='button'
                    variant='secondary'
                    onClick={handleSaveDraft}
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : 'Save as Draft'}
                  </Button>
                  <Button type='submit' variant='primary' disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Report'}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        );
      case 1:
        if (loading) {
          return (
            <div className='space-y-4'>
              <SkeletonCard />
              <SkeletonCard />
            </div>
          );
        }
        if (error) return <p>Error: {error}</p>;
        if (reports.length === 0) return <p>No reports yet</p>;

        return (
          <div className='space-y-4'>
            {reports.map(r => (
              <Card key={r.id} className='p-6'>
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='text-lg font-semibold'>
                      {getMonthName(Number(r.month))} {Number(r.year)}
                    </h3>
                    <p className='text-sm text-gray-500'>
                      Created:{' '}
                      {new Date(
                        Number(r.createdAt) / 1000000
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                      r.status
                    )}`}
                  >
                    {getStatusIcon(r.status)} {getStatusText(r.status)}
                  </span>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Revenue</p>
                    <p className='font-semibold'>
                      {formatCurrency(Number(r.revenue) / 100)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Expenses</p>
                    <p className='font-semibold'>
                      {formatCurrency(Number(r.expenses) / 100)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Profit</p>
                    <p className='font-semibold text-green-600'>
                      {formatCurrency(Number(r.profit) / 100)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Profit Sharing</p>
                    <p className='font-semibold text-purple-600'>
                      {formatCurrency(Number(r.profitSharingAmount) / 100)}
                    </p>
                  </div>
                </div>

                <div className='flex justify-between items-center'>
                  <div className='text-sm text-gray-600'>
                    <span>Investors: {Number(r.investorCount)}</span>
                    <span className='ml-4'>New: {Number(r.newInvestors)}</span>
                  </div>
                  <Button variant='secondary' size='sm'>
                    <Eye size={16} /> View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        );
      case 2:
        return (
          <Card className='p-6'>
            <div className='text-center py-12'>
              <FileText size={48} className='mx-auto text-gray-400 mb-4' />
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Report Templates
              </h3>
              <p className='text-gray-600 mb-4'>
                Templates feature is coming soon. This will help you create
                reports faster with pre-filled data.
              </p>
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  if (!startupId) {
    return <p>Please select startup</p>;
  }

  return (
    <div className='bg-neutral-100 rounded-[16px] p-6'>
      <h2 className='text-xl font-semibold mb-4'>Monthly Reports</h2>

      <div className='flex gap-2 mb-6 border border-neutral-200 rounded-full w-fit'>
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition rounded-[12px] ${
              activeSubTab === tab.id
                ? 'bg-[#7A5AF8] text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className='min-h-[400px]'>{renderSubTabContent()}</div>
    </div>
  );
}
