import { useState } from 'react';
import { FileText, Plus, Upload, X, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Alert, Button, Card, FileUpload, Input, Textarea } from '../../../../components/ui';
import { useMonthlyReports } from '../../../../hooks/useMonthlyReports';
import { formatCurrency, formatNumber } from '../../../../utils/formatCurrency';

export default function MonthlyReports({ startupId }) {
  const { reports, loading, error, submitReport, saveDraft } = useMonthlyReports(startupId);
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [showReportForm, setShowReportForm] = useState(false);
  
  
  const [formData, setFormData] = useState({
    // Financial Performance
    monthlyRevenue: '',
    netProfit: '',
    monthlyExpenses: '',
    cashFlow: '',
    varianceFromProjection: '',

    // Operational Updates
    keyAchievements: '',
    milestonesReached: '',
    challengesFaced: '',
    solutionsImplemented: '',

    // Market Conditions
    competitiveLandscape: '',
    marketChanges: '',
    customerFeedback: '',
    demandShifts: '',

    // Forward Looking
    nextMonthPlans: '',
    expectedChallenges: '',
    resourceNeeds: '',
    growthProjections: '',

    // Communication
    investorMessages: '',
    communityUpdates: '',
    partnershipNews: '',
    teamChanges: '',
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
    try {
      const result = await submitReport(formData);
      if (result.success) {
        setShowReportForm(false);
        setFormData({
          monthlyRevenue: '',
          netProfit: '',
          monthlyExpenses: '',
          cashFlow: '',
          varianceFromProjection: '',
          keyAchievements: '',
          milestonesReached: '',
          challengesFaced: '',
          solutionsImplemented: '',
          competitiveLandscape: '',
          marketChanges: '',
          customerFeedback: '',
          demandShifts: '',
          nextMonthPlans: '',
          expectedChallenges: '',
          resourceNeeds: '',
          growthProjections: '',
          investorMessages: '',
          communityUpdates: '',
          partnershipNews: '',
          teamChanges: '',
        });
        alert('Report submitted successfully!');
      } else {
        alert('Error submitting report: ' + result.error);
      }
    } catch (error) {
      alert('Error submitting report: ' + error.message);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const result = await saveDraft(formData);
      if (result.success) {
        setShowReportForm(false);
        alert('Draft saved successfully!');
      } else {
        alert('Error saving draft: ' + result.error);
      }
    } catch (error) {
      alert('Error saving draft: ' + error.message);
    }
  };

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 0:
        if (showReportForm) {
          return (
            <div className='space-y-6'>
              <div className='bg-white rounded-[16px] p-6 border border-gray-200'>
                <div className='flex justify-between items-center mb-6'>
                  <h3 className='text-xl font-semibold text-gray-900'>
                    January 2025 Report
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
                        label='Monthly revenue (xUSDC)'
                        value={formData.monthlyRevenue}
                        onChange={e =>
                          handleInputChange('monthlyRevenue', e.target.value)
                        }
                        placeholder='0'
                      />
                      <Input
                        type='number'
                        label='Net profit (xUSDC)'
                        value={formData.netProfit}
                        onChange={e =>
                          handleInputChange('netProfit', e.target.value)
                        }
                        placeholder='0'
                      />
                      <Input
                        type='number'
                        label='Monthly expenses (xUSDC)'
                        value={formData.monthlyExpenses}
                        onChange={e =>
                          handleInputChange('monthlyExpenses', e.target.value)
                        }
                        placeholder='0'
                      />
                      <Input
                        type='number'
                        label='Cash flow (xUSDC)'
                        value={formData.cashFlow}
                        onChange={e =>
                          handleInputChange('cashFlow', e.target.value)
                        }
                        placeholder='0'
                      />
                      <Input
                        type='number'
                        label='Variance from projection (%)'
                        value={formData.varianceFromProjection}
                        onChange={e =>
                          handleInputChange(
                            'varianceFromProjection',
                            e.target.value
                          )
                        }
                        placeholder='0'
                      />
                    </div>
                  </Card>

                  {/* Operational Updates */}
                  <Card>
                    <h4 className='text-lg font-semibold text-gray-900 mb-4'>
                      Operational Updates
                    </h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <Textarea
                        label='Key achievements'
                        value={formData.keyAchievements}
                        onChange={e =>
                          handleInputChange('keyAchievements', e.target.value)
                        }
                        rows={6}
                        placeholder='List key achievements this month...'
                      />
                      <Textarea
                        label='Milestones reached'
                        value={formData.milestonesReached}
                        onChange={e =>
                          handleInputChange(
                            'milestonesReached',
                            e.target.value
                          )
                        }
                        rows={6}
                        placeholder='List milestones reached this month...'
                      />
                      <Textarea
                        label='Challenges faced'
                        value={formData.challengesFaced}
                        onChange={e =>
                          handleInputChange('challengesFaced', e.target.value)
                        }
                        rows={6}
                        placeholder='List challenges faced this month...'
                      />
                      <Textarea
                        label='Solutions implemented'
                        value={formData.solutionsImplemented}
                        onChange={e =>
                          handleInputChange(
                            'solutionsImplemented',
                            e.target.value
                          )
                        }
                        rows={6}
                        placeholder='List solutions implemented this month...'
                      />
                    </div>
                  </Card>

                  {/* Visual Evidence */}
                  <Card>
                    <h4 className='text-lg font-semibold text-gray-900 mb-4'>
                      Visual Evidence
                    </h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <FileUpload
                        label='Upload images'
                        accept='image/*,.pdf'
                        fileTypes='jpg, png, or pdf'
                        maxSize='2MB'
                        onFileSelect={(files) => console.log('Images selected:', files)}
                      />
                      <FileUpload
                        label='Upload videos'
                        accept='video/*'
                        fileTypes='mp4, avi, or mov'
                        maxSize='20MB'
                        onFileSelect={(files) => console.log('Videos selected:', files)}
                      />
                    </div>
                  </Card>

                  {/* Market Conditions */}
                  <Card>
                    <h4 className='text-lg font-semibold text-gray-900 mb-4'>
                      Market Conditions
                    </h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <Textarea
                        label='Competitive landscape'
                        value={formData.competitiveLandscape}
                        onChange={e =>
                          handleInputChange(
                            'competitiveLandscape',
                            e.target.value
                          )
                        }
                        rows={6}
                        placeholder='Describe changes in competitive landscape...'
                      />
                      <Textarea
                        label='Market changes'
                        value={formData.marketChanges}
                        onChange={e =>
                          handleInputChange('marketChanges', e.target.value)
                        }
                        rows={6}
                        placeholder='Describe market changes observed.'
                      />
                      <Textarea
                        label='Customer feedback'
                        value={formData.customerFeedback}
                        onChange={e =>
                          handleInputChange(
                            'customerFeedback',
                            e.target.value
                          )
                        }
                        rows={6}
                        placeholder='Share key customer feedback.'
                      />
                      <Textarea
                        label='Demand shifts'
                        value={formData.demandShifts}
                        onChange={e =>
                          handleInputChange('demandShifts', e.target.value)
                        }
                        rows={6}
                        placeholder='Describe any demand shifts.'
                      />
                    </div>
                  </Card>

                  {/* Forward Looking */}
                  <Card>
                    <h4 className='text-lg font-semibold text-gray-900 mb-4'>
                      Forward Looking
                    </h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <Textarea
                        label='Next month plans'
                        value={formData.nextMonthPlans}
                        onChange={e =>
                          handleInputChange('nextMonthPlans', e.target.value)
                        }
                        rows={6}
                        placeholder='Outline plans for next month...'
                      />
                      <Textarea
                        label='Expected challenges'
                        value={formData.expectedChallenges}
                        onChange={e =>
                          handleInputChange(
                            'expectedChallenges',
                            e.target.value
                          )
                        }
                        rows={6}
                        placeholder='Identify expected challenges...'
                      />
                      <Textarea
                        label='Resource needs'
                        value={formData.resourceNeeds}
                        onChange={e =>
                          handleInputChange('resourceNeeds', e.target.value)
                        }
                        rows={6}
                        placeholder='Specify resource needs...'
                      />
                      <Textarea
                        label='Growth projections'
                        value={formData.growthProjections}
                        onChange={e =>
                          handleInputChange(
                            'growthProjections',
                            e.target.value
                          )
                        }
                        rows={6}
                        placeholder='Share growth projections...'
                      />
                    </div>
                  </Card>

                  {/* Communication */}
                  <Card>
                    <h4 className='text-lg font-semibold text-gray-900 mb-4'>
                      Communication
                    </h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <Textarea
                        label='Investor messages'
                        value={formData.investorMessages}
                        onChange={e =>
                          handleInputChange(
                            'investorMessages',
                            e.target.value
                          )
                        }
                        rows={6}
                        placeholder='Message to investors...'
                      />
                      <Textarea
                        label='Community updates'
                        value={formData.communityUpdates}
                        onChange={e =>
                          handleInputChange(
                            'communityUpdates',
                            e.target.value
                          )
                        }
                        rows={6}
                        placeholder='Updates for the community.'
                      />
                      <Textarea
                        label='Partnership news'
                        value={formData.partnershipNews}
                        onChange={e =>
                          handleInputChange('partnershipNews', e.target.value)
                        }
                        rows={6}
                        placeholder='Partnership announcements.'
                      />
                      <Textarea
                        label='Team changes'
                        value={formData.teamChanges}
                        onChange={e =>
                          handleInputChange('teamChanges', e.target.value)
                        }
                        rows={6}
                        placeholder='Team updates.'
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
                      >
                        Save to draft
                      </Button>
                      <Button
                        type='submit'
                        variant='primary'
                      >
                        Submit reports
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
                  January 2025 Report
                </h3>
                <p className='text-gray-600 mb-4'>Due: January 10, 2025</p>
                <p className='text-red-500 text-sm mb-8'>251 days remaining</p>
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
                      {report.month} {report.year} Report
                    </h3>
                    <p className='text-sm text-gray-500'>
                      Submitted: {report.submittedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    {report.status === 'submitted' ? (
                      <span className='flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm'>
                        <CheckCircle size={14} />
                        Submitted
                      </span>
                    ) : (
                      <span className='flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm'>
                        <Clock size={14} />
                        Draft
                      </span>
                    )}
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Monthly Revenue</p>
                    <p className='text-lg font-semibold'>{formatCurrency(report.financialData.monthlyRevenue)}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Net Profit</p>
                    <p className='text-lg font-semibold'>{formatCurrency(report.financialData.netProfit)}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Variance</p>
                    <p className={`text-lg font-semibold ${report.financialData.varianceFromProjection >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatNumber(report.financialData.varianceFromProjection)}%
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Key Achievements</p>
                    <p className='text-sm text-gray-700 line-clamp-2'>{report.operationalData.keyAchievements}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Next Month Plans</p>
                    <p className='text-sm text-gray-700 line-clamp-2'>{report.forwardLooking.nextMonthPlans}</p>
                  </div>
                </div>

                <div className='mt-4 flex justify-end'>
                  <Button variant='secondary' size='sm'>
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
                Create and manage report templates
              </p>
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
