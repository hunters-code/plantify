import { useState } from 'react';
import { FileText, Plus, Upload, X, Calendar, CheckCircle, Clock, Eye, Edit } from 'lucide-react';
import { Alert, Button, Card, FileUpload, Input, Textarea } from '../../../../components/ui';
import { useMonthlyReports } from '../../../../hooks/useMonthlyReports';
import { formatCurrency, formatNumber } from '../../../../utils/formatCurrency';

export default function MonthlyReports({ startupId }) {
  const { reports, loading, error, submitReport, saveDraft } = useMonthlyReports(startupId);
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [showReportForm, setShowReportForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const [formData, setFormData] = useState({
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async e => {
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
    } catch (error) {
      setSubmitMessage(`Error: ${error.message}`);
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
    } catch (error) {
      setSubmitMessage(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Submitted':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Draft':
        return <Edit className="w-4 h-4 text-gray-500" />;
      case 'Rejected':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(Number(timestamp) / 1000000); // Convert from nanoseconds
    return date.toLocaleDateString();
  };

  const getMonthName = (monthNumber) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1] || 'Unknown';
  };

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 0:
        if (showReportForm) {
          return (
            <div className='space-y-6'>
              {submitMessage && (
                <Alert 
                  type={submitMessage.includes('Error') ? 'error' : 'success'}
                  message={submitMessage}
                />
              )}
              
              <div className='bg-white rounded-[16px] p-6 border border-gray-200'>
                <div className='flex justify-between items-center mb-6'>
                  <h3 className='text-xl font-semibold text-gray-900'>
                    {getMonthName(new Date().getMonth() + 1)} {new Date().getFullYear()} Report
                  </h3>
                  <button
                    onClick={() => setShowReportForm(false)}
                    className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                  >
                    <X size={20} className='text-gray-500' />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className='space-y-6'>
                  {/* Financial Performance */}
                  <Card>
                    <h4 className='text-lg font-semibold text-gray-900 mb-4'>
                      Financial Performance
                    </h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                      <Input
                        type='number'
                        label='Monthly revenue (ckUSDC)'
                        value={formData.monthlyRevenue}
                        onChange={e =>
                          handleInputChange('monthlyRevenue', e.target.value)
                        }
                        placeholder='0'
                        required
                      />
                      <Input
                        type='number'
                        label='Monthly expenses (ckUSDC)'
                        value={formData.monthlyExpenses}
                        onChange={e =>
                          handleInputChange('monthlyExpenses', e.target.value)
                        }
                        placeholder='0'
                        required
                      />
                      <Input
                        type='number'
                        label='Net profit (ckUSDC)'
                        value={formData.netProfit}
                        onChange={e =>
                          handleInputChange('netProfit', e.target.value)
                        }
                        placeholder='0'
                        required
                      />
                      <Input
                        type='number'
                        label='Profit sharing amount (ckUSDC)'
                        value={formData.profitSharingAmount}
                        onChange={e =>
                          handleInputChange('profitSharingAmount', e.target.value)
                        }
                        placeholder='0'
                        required
                      />
                      <Input
                        type='number'
                        label='Total investors'
                        value={formData.investorCount}
                        onChange={e =>
                          handleInputChange('investorCount', e.target.value)
                        }
                        placeholder='0'
                        required
                      />
                      <Input
                        type='number'
                        label='New investors this month'
                        value={formData.newInvestors}
                        onChange={e =>
                          handleInputChange('newInvestors', e.target.value)
                        }
                        placeholder='0'
                        required
                      />
                    </div>
                  </Card>

                  {/* Action Buttons */}
                  <Card>
                    <div className='flex justify-end gap-4'>
                      <Button
                        type='button'
                        variant='secondary'
                        onClick={handleSaveDraft}
                        disabled={submitting}
                      >
                        {submitting ? 'Saving...' : 'Save as Draft'}
                      </Button>
                      <Button
                        type='submit'
                        variant='primary'
                        disabled={submitting}
                      >
                        {submitting ? 'Submitting...' : 'Submit Report'}
                      </Button>
                    </div>
                  </Card>
                </form>
              </div>
            </div>
          );
        } else {
          return (
            <Card>
              <div className='flex flex-col items-center justify-center py-16 px-8'>
                <div className='w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-6'>
                  <FileText size={48} className='text-gray-400' />
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  {getMonthName(new Date().getMonth() + 1)} {new Date().getFullYear()} Report
                </h3>
                <p className='text-gray-600 mb-4'>
                  Due: {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 10).toLocaleDateString()}
                </p>
                <Button
                  onClick={() => setShowReportForm(true)}
                  variant='primary'
                >
                  <Plus size={16} />
                  Start new report
                </Button>
              </div>
            </Card>
          );
        }
      case 1:
        if (loading) {
          return (
            <Card>
              <div className='animate-pulse p-6'>
                <div className='h-6 bg-gray-300 rounded mb-4 w-1/3'></div>
                <div className='space-y-4'>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className='h-20 bg-gray-300 rounded'></div>
                  ))}
                </div>
              </div>
            </Card>
          );
        }

        if (error) {
          return (
            <Card>
              <div className='p-6 text-center'>
                <div className='text-red-600'>
                  <h3 className='text-xl font-semibold mb-2'>Error Loading Reports</h3>
                  <p>{error}</p>
                </div>
              </div>
            </Card>
          );
        }

        if (reports.length === 0) {
          return (
            <Card>
              <div className='flex flex-col items-center justify-center py-16 px-8'>
                <div className='w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-6'>
                  <FileText size={48} className='text-gray-400' />
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  No Reports Yet
                </h3>
                <p className='text-gray-600 mb-8'>
                  You haven't submitted any monthly reports yet.
                </p>
              </div>
            </Card>
          );
        }

        return (
          <div className='space-y-4'>
            {reports.map((report) => (
              <Card key={report.id} className='p-6'>
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      {getMonthName(report.month)} {report.year} Report
                    </h3>
                    <p className='text-sm text-gray-500'>
                      Submitted: {formatDate(report.submittedAt)}
                    </p>
                    {report.approvedAt && (
                      <p className='text-sm text-gray-500'>
                        Approved: {formatDate(report.approvedAt)}
                      </p>
                    )}
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      {report.status}
                      </span>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Monthly Revenue</p>
                    <p className='text-lg font-semibold'>{formatCurrency(Number(report.revenue))}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Net Profit</p>
                    <p className='text-lg font-semibold'>{formatCurrency(Number(report.profit))}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Profit Sharing</p>
                    <p className='text-lg font-semibold'>{formatCurrency(Number(report.profitSharingAmount))}</p>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Total Investors</p>
                    <p className='text-lg font-semibold'>{formatNumber(Number(report.investorCount))}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>New Investors</p>
                    <p className='text-lg font-semibold'>{formatNumber(Number(report.newInvestors))}</p>
                  </div>
                </div>

                <div className='mt-4 flex justify-end'>
                  <Button variant='secondary' size='sm'>
                    <Eye size={16} className="mr-2" />
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        );
      case 2:
        return (
          <Card>
            <div className='flex flex-col items-center justify-center py-16 px-8'>
              <div className='w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-6'>
                <FileText size={48} className='text-gray-400' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Report Templates
              </h3>
              <p className='text-gray-600 mb-8'>
                Create and manage report templates for faster reporting
              </p>
              <Button variant='primary'>
                <Plus size={16} />
                Create Template
              </Button>
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  if (!startupId) {
    return (
      <div className='bg-neutral-100 rounded-[16px] p-6'>
        <div className='text-center py-8'>
          <h2 className='text-xl font-semibold mb-2'>No Startup Selected</h2>
          <p className='text-gray-500'>Please select a startup from the dropdown above.</p>
        </div>
      </div>
    );
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
                ? 'bg-[#7A5AF8] text-white shadow-[0_3px_3px_rgba(255,255,255,0.40)_inset,0_-2px_1px_rgba(0,0,0,0.25)_inset,0_2px_4px_rgba(0,0,0,0.16)]'
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