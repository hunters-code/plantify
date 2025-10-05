import { useState } from 'react';
import {
  FileText,
  Plus,
  X,
  CheckCircle,
  Clock,
  Eye,
  Edit,
} from 'lucide-react';
import {
  Alert,
  Button,
  Card,
  Input,
} from '@/components/ui';
import { formatCurrency } from '@/utils/formatCurrency';

type MonthlyReport = {
  id: number;
  month: number;
  year: number;
  revenue: number;
  profit: number;
  profitSharingAmount: number;
  investorCount: number;
  newInvestors: number;
  status: 'Approved' | 'Submitted' | 'Draft' | 'Rejected';
  submittedAt?: string;
  approvedAt?: string;
};

type FormData = {
  monthlyRevenue: string;
  monthlyExpenses: string;
  netProfit: string;
  profitSharingAmount: string;
  investorCount: string;
  newInvestors: string;
};

function useMonthlyReports(startupId: string | number) {
  const dummyReports: MonthlyReport[] = [
    {
      id: 1,
      month: 8,
      year: 2025,
      revenue: 5000,
      profit: 2000,
      profitSharingAmount: 500,
      investorCount: 10,
      newInvestors: 2,
      status: 'Approved',
      submittedAt: `${Date.now() * 1000000}`,
      approvedAt: `${Date.now() * 1000000}`,
    },
    {
      id: 2,
      month: 7,
      year: 2025,
      revenue: 4000,
      profit: 1500,
      profitSharingAmount: 400,
      investorCount: 9,
      newInvestors: 1,
      status: 'Submitted',
      submittedAt: `${Date.now() * 1000000}`,
    },
  ];

  const [reports] = useState<MonthlyReport[]>(dummyReports);
  const [loading] = useState(false); 
  const [error] = useState<string | null>(null);

  const submitReport = async (form: FormData) => {
    console.log('Submitting...', form);
    return { success: true };
  };

  const saveDraft = async (form: FormData) => {
    console.log('Saving draft...', form);
    return { success: true };
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
        setSubmitMessage(`Error: ${(result as any).error}`);
      }
    } catch (err: any) {
      setSubmitMessage(`Error: ${err.message}`);
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
        setSubmitMessage(`Error: ${(result as any).error}`);
      }
    } catch (err: any) {
      setSubmitMessage(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: MonthlyReport['status']) => {
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

  const getStatusColor = (status: MonthlyReport['status']) => {
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

  const getMonthName = (monthNumber: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return months[monthNumber - 1] || 'Unknown';
  };

  // Skeleton loader
  const SkeletonCard = () => (
    <Card className="p-6 animate-pulse">
      <div className="h-4 w-32 bg-gray-300 rounded mb-4"></div>
      <div className="h-3 w-24 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 w-40 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 w-20 bg-gray-200 rounded mb-4"></div>
      <div className="h-8 w-24 bg-gray-300 rounded"></div>
    </Card>
  );

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 0:
        return (
          <Card>
            {!showReportForm ? (
              <div className="flex flex-col items-center justify-center py-16 px-8">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                  <FileText size={48} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {getMonthName(new Date().getMonth() + 1)} {new Date().getFullYear()} Report
                </h3>
                <p className="text-gray-600 mb-4">
                  Due: {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 10).toLocaleDateString()}
                </p>
                <Button onClick={() => setShowReportForm(true)} variant="primary">
                  <Plus size={16} />
                  Start new report
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 p-6">
                {submitMessage && (
                  <Alert
                    type={submitMessage.includes('Error') ? 'error' : 'success'}
                    message={submitMessage}
                  />
                )}

                <Input
                  type="number"
                  label="Monthly Revenue"
                  value={formData.monthlyRevenue}
                  onChange={e => handleInputChange('monthlyRevenue', e.target.value)}
                />

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="secondary" onClick={handleSaveDraft} disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save as Draft'}
                  </Button>
                  <Button type="submit" variant="primary" disabled={submitting}>
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
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          );
        }
        if (error) return <p>Error: {error}</p>;
        if (reports.length === 0) return <p>No reports yet</p>;

        return (
          <div className="space-y-4">
            {reports.map(r => (
              <Card key={r.id} className="p-6">
                <h3>{getMonthName(r.month)} {r.year}</h3>
                <p className="flex items-center gap-2">
                  Status: <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(r.status)}`}>
                    {getStatusIcon(r.status)} {r.status}
                  </span>
                </p>
                <p>Revenue: {formatCurrency(r.revenue)}</p>
                <p>Profit: {formatCurrency(r.profit)}</p>
                <Button><Eye size={16} /> View</Button>
              </Card>
            ))}
          </div>
        );
      case 2:
        return <p>Templates tab (dummy)</p>;
      default:
        return null;
    }
  };

  if (!startupId) {
    return <p>Please select startup</p>;
  }

  return (
    <div className="bg-neutral-100 rounded-[16px] p-6">
      <h2 className="text-xl font-semibold mb-4">Monthly Reports</h2>

      <div className="flex gap-2 mb-6 border border-neutral-200 rounded-full w-fit">
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition rounded-[12px] ${activeSubTab === tab.id
                ? 'bg-[#7A5AF8] text-white'
                : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">{renderSubTabContent()}</div>
    </div>
  );
}
