import { useState } from 'react';
import {
  Building2,
  Briefcase,
  Users,
  DollarSign,
  FileText,
  CheckCircle,
  CircleArrowRight,
  CircleArrowLeft,
  CircleCheckBig,
  Loader2,
} from 'lucide-react';
import { Navbar, Footer } from '../../../components';
import BasicInformationStep from '../../../components/startup/steps/BasicInformationStep';
import BusinessDetailsStep from '../../../components/startup/steps/BusinessDetailsStep';
import TeamBackgroundStep from '../../../components/startup/steps/TeamBackgroundStep';
import FinancialProjectionsStep from '../../../components/startup/steps/FinancialProjectionsStep';
import CollateralSetupStep from '../../../components/startup/steps/CollateralSetupStep';
import ReviewSubmitStep from '../../../components/startup/steps/ReviewSubmitStep';

export default function CreateStartupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    startupName: '',
    logo: null,
    sector: '',
    foundedYear: '',
    companyType: '',
    location: '',
    description: '',
    website: '',

    // Business Details
    problemStatement: '',
    solution: '',
    targetMarket: '',
    competitiveAdvantage: '',
    marketingStrategy: '',
    operationalProcess: '',

    // Team & Background
    founderName: '',
    founderRole: '',
    founderEmail: '',
    founderLinkedIn: '',
    founderBackground: '',
    founderPhoto: null,
    teamMembers: [],
    advisors: '',

    // Financial Projections
    fundingGoal: '',
    nftPrice: '',
    monthlyProfitSharing: '',
    expectedMonthlyRevenue: '',
    expectedMonthlyExpenses: '',
    breakEvenMonth: '',
    revenueModel: '',
    useOfFunds: '',

    // Documents
    businessPlan: null,
    financialProjectionsFile: null,
    legalDocuments: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs = [
    {
      id: 1,
      label: 'Basic Information',
      icon: <Building2 className='w-4 h-4' />,
    },
    {
      id: 2,
      label: 'Business Details',
      icon: <Briefcase className='w-4 h-4' />,
    },
    {
      id: 3,
      label: 'Team & Background',
      icon: <Users className='w-4 h-4' />,
    },
    {
      id: 4,
      label: 'Financial Projections',
      icon: <DollarSign className='w-4 h-4' />,
    },
    {
      id: 5,
      label: 'Collateral Setup',
      icon: <FileText className='w-4 h-4' />,
    },
    {
      id: 6,
      label: 'Review & Submit',
      icon: <CheckCircle className='w-4 h-4' />,
    },
  ];

  const validateStep = currentStep => {
    const newErrors = {};

    switch (currentStep) {
      case 1:
        if (!formData.startupName)
          newErrors.startupName = 'Startup name is required';
        if (!formData.sector) newErrors.sector = 'Business sector is required';
        if (!formData.foundedYear)
          newErrors.foundedYear = 'Founded year is required';
        if (!formData.companyType)
          newErrors.companyType = 'Company type is required';
        if (!formData.location) newErrors.location = 'Location is required';
        if (!formData.description)
          newErrors.description = 'Business description is required';
        break;
      case 2:
        if (!formData.problemStatement)
          newErrors.problemStatement = 'Problem statement is required';
        if (!formData.solution) newErrors.solution = 'Solution is required';
        if (!formData.targetMarket)
          newErrors.targetMarket = 'Target market is required';
        if (!formData.competitiveAdvantage)
          newErrors.competitiveAdvantage = 'Competitive advantage is required';
        if (!formData.marketingStrategy)
          newErrors.marketingStrategy = 'Marketing strategy is required';
        if (!formData.operationalProcess)
          newErrors.operationalProcess = 'Operational process is required';
        break;
      case 3:
        if (!formData.founderName)
          newErrors.founderName = 'Founder name is required';
        if (!formData.founderRole)
          newErrors.founderRole = 'Founder role is required';
        if (!formData.founderEmail)
          newErrors.founderEmail = 'Founder email is required';
        if (!formData.founderLinkedIn)
          newErrors.founderLinkedIn = 'Founder LinkedIn is required';
        if (!formData.founderBackground)
          newErrors.founderBackground = 'Founder background is required';
        if (!formData.advisors)
          newErrors.advisors = 'Advisors information is required';
        break;
      case 4:
        if (!formData.fundingGoal)
          newErrors.fundingGoal = 'Funding goal is required';
        if (!formData.monthlyProfitSharing)
          newErrors.monthlyProfitSharing = 'Monthly profit sharing is required';
        if (!formData.expectedMonthlyRevenue)
          newErrors.expectedMonthlyRevenue =
            'Expected monthly revenue is required';
        if (!formData.breakEvenMonth)
          newErrors.breakEvenMonth = 'Break-even month is required';
        if (!formData.revenueModel)
          newErrors.revenueModel = 'Revenue model is required';
        if (!formData.useOfFunds)
          newErrors.useOfFunds = 'Use of funds is required';
        break;
      case 5:
        // File validations would be handled by the file upload components
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < tabs.length) setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleEdit = stepNumber => {
    setStep(stepNumber);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would submit the form data to your backend
      console.log('Submitting startup data:', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Handle success (redirect, show success message, etc.)
      alert('Startup submitted successfully!');
    } catch (error) {
      console.error('Error submitting startup:', error);
      alert('Error submitting startup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className='bg-gray-50 text-gray-900 min-h-screen'>
      <Navbar />

      <div className='max-w-7xl mx-auto mt-8 mb-8'>
        {/* Progress Steps */}
        <div className='flex justify-center mb-8'>
          <div className='flex items-center space-x-2 bg-white rounded-full p-2 shadow-sm max-w-7xl w-full'>
            {tabs.map((tab, index) => (
              <div key={tab.id} className='flex items-center w-full'>
                <button
                  className={`
            flex justify-center items-center gap-[6px] flex-1
            px-4 py-2 rounded-[12px] text-sm font-medium transition-all duration-200
            ${
              step === tab.id
                ? 'bg-[#F5F5F5] shadow-[inset_0_3px_3px_rgba(255,255,255,0.4),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)] text-gray-900'
                : step > tab.id
                  ? 'bg-gray-100 text-gray-600'
                  : 'text-gray-400'
            }`}
                  onClick={() => setStep(tab.id)}
                >
                  {tab.icon}
                  <span className='hidden sm:inline'>{tab.label}</span>
                </button>
                {index < tabs.length - 1 && (
                  <div className='w-8 h-px bg-gray-200 mx-1'></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className='bg-neutral-100 rounded-2xl shadow-sm p-8'>
          {step === 1 && (
            <BasicInformationStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}

          {step === 2 && (
            <BusinessDetailsStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}

          {step === 3 && (
            <TeamBackgroundStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}

          {step === 4 && (
            <FinancialProjectionsStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}

          {step === 5 && (
            <CollateralSetupStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}

          {step === 6 && (
            <ReviewSubmitStep formData={formData} onEdit={handleEdit} />
          )}
        </div>

        {/* Navigation */}
        <div className='flex justify-between mt-2 pt-6 border-t border-gray-100'>
          {/* Previous Button */}
          {step > 1 ? (
            <button
              onClick={prevStep}
              className='flex justify-center items-center gap-[6px] px-4 py-3 rounded-[12px] border border-[#E5E5E5] bg-[#F5F5F5] shadow-[inset_0_3px_3px_rgba(255,255,255,0.40),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)] text-gray-900 font-medium text-[16px]'
            >
              <CircleArrowLeft size={16} /> Previous
            </button>
          ) : (
            <div></div>
          )}

          {/* Next / Submit Button */}
          {step < tabs.length ? (
            <button
              onClick={nextStep}
              disabled={isSubmitting}
              className='flex justify-center items-center gap-[6px] px-4 py-3 rounded-[12px] border border-white/20 bg-[#7A5AF8] shadow-[inset_0_3px_3px_rgba(255,255,255,0.40),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)] text-white font-medium transition-all duration-200 hover:opacity-90 text-[16px] disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Next <CircleArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className='flex justify-center items-center gap-[6px] px-4 py-3 rounded-[12px] border border-white/20 bg-[#7A5AF8] shadow-[inset_0_3px_3px_rgba(255,255,255,0.40),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)] text-white font-medium transition-all duration-200 hover:opacity-90 text-[16px] disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className='animate-spin' />
                  Submitting...
                </>
              ) : (
                <>
                  <CircleCheckBig size={16} /> Submit Startup
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
