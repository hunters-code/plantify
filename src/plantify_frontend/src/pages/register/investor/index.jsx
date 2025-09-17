import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Briefcase,
  CheckCircle,
  FileText,
  ArrowRight,
  CircleArrowRight,
  CircleCheckBig,
  CircleArrowLeft,
  Loader2,
  AlertCircle,
  Banknote,
  Brain,
} from 'lucide-react';
import { Navbar, Footer } from '../../../components';
import PersonalInformationForm from './components/PersonalInformationForm';
import InvestmentProfile from './components/InvestmentProfile';
import KnowladgeAssessment from './components/KnowladgeAssessment';
import TermsAgreementForm from './components/TermsAgreementForm';
import { useRegistration } from '../../../hooks/useRegistration';
import { useAuth } from '../../../contexts/AuthContext';

export default function RegisterInvestor() {
  const navigate = useNavigate();
  const {
    registerInvestor,
    loading,
    error: hookError,
    success,
    isAvailable,
    isBackendDeclarationsAvailable,
  } = useRegistration();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    address: '',

    // Professional Background
    experience: '',
    previousBusinesses: '',
    expertise: '',
    linkedIn: '',

    // Verification Documents
    idNumber: '',
    taxNumber: '',

    // Terms & Agreement
    terms: false,
    risks: false,
    transparency: false,
  });

  const tabs = [
    {
      id: 1,
      label: 'Personal Information',
      icon: <User className='w-4 h-4' />,
    },
    {
      id: 2,
      label: 'Investment Profile',
      icon: <Banknote className='w-4 h-4' />,
    },
    { id: 3, label: 'Knowladge Assessment', icon: <Brain className='w-4 h-4' /> },
    {
      id: 4,
      label: 'Terms & Agreement',
      icon: <FileText className='w-4 h-4' />,
    },
  ];

  // Handle successful registration
  useEffect(() => {
    if (success) {
      // Redirect to success page or dashboard
      // navigate('/auth?registered=true');
    }
  }, [success, navigate]);

  // Clear local error when step changes
  useEffect(() => {
    setError(null);
  }, [step]);
  // Authentication check to redirect if not authenticated
  useEffect(() => {
    // Only redirect if authentication check is complete and user is not authenticated
    if (!authLoading && isAuthenticated === false) {
      navigate('/auth');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const nextStep = () => {
    if (step < tabs.length) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Check if user is authenticated first
      if (!isAuthenticated) {
        setError('Please authenticate first before registering.');
        return;
      }

      // Try to load backend declarations if not available
      if (!isBackendDeclarationsAvailable()) {
        // Check if backend declarations were loaded successfully
        if (!isBackendDeclarationsAvailable()) {
          setError(
            'Failed to load backend declarations. Please ensure the backend is running and try again.'
          );
          return;
        }
      }

      // Check if backend is available
      if (!isAvailable) {
        setError(
          'Backend connection not available. Please ensure you are authenticated and the backend is running.'
        );
        return;
      }

      // Register founder
      const result = await registerFounder(formData);

      if (result.success) {
        // Success is handled by useEffect
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className='bg-gray-50 text-gray-900 min-h-screen flex flex-col'>
        <Navbar />

        <div className='flex-1 flex flex-col items-center justify-center'>
          <div className='flex flex-col items-center gap-4 p-8'>
            <Loader2 size={48} className='text-purple-600 animate-spin' />
          </div>
        </div>
      </div>
    );
  }

  // Main content when loaded
  return (
    <div className='bg-gray-50 text-gray-900 min-h-screen'>
      <Navbar />

      <div className='max-w-7xl mx-auto mt-8 mb-8'>
        {/* Error Message */}
        {(error || hookError) && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3'>
            <AlertCircle className='w-5 h-5 text-red-500 flex-shrink-0' />
            <div className='text-red-700 text-sm'>{error || hookError}</div>
          </div>
        )}

        {/* Authentication Status - only show if not authenticated */}
        {!isAuthenticated && (
          <div className='mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3'>
            <AlertCircle className='w-5 h-5 text-yellow-500 flex-shrink-0' />
            <div className='text-yellow-700 text-sm'>
              Please authenticate first before registering.{' '}
              <a href='/auth' className='underline'>
                Click here to sign in
              </a>
              .
            </div>
          </div>
        )}

        {/* Backend Status - Only show when submitting form */}
        {error && error.includes('backend') && (
          <div className='mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3'>
            <AlertCircle className='w-5 h-5 text-blue-500 flex-shrink-0' />
            <div className='text-blue-700 text-sm'>
              Backend connection issue. The form will try to connect
              automatically when submitting.
            </div>
          </div>
        )}

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
            <PersonalInformationForm
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {step === 2 && (
            <InvestmentProfile
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {step === 3 && (
            <KnowladgeAssessment
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {step === 4 && (
            <TermsAgreementForm
              formData={formData}
              handleInputChange={handleInputChange}
            />
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
              disabled={loading}
              className='flex justify-center items-center gap-[6px] px-4 py-3 rounded-[12px] border border-white/20 bg-[#7A5AF8] shadow-[inset_0_3px_3px_rgba(255,255,255,0.40),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)] text-white font-medium transition-all duration-200 hover:opacity-90 text-[16px] disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Next <CircleArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={
                loading ||
                !formData.terms ||
                !formData.risks ||
                !formData.transparency
              }
              className='flex justify-center items-center gap-[6px] px-4 py-3 rounded-[12px] border border-white/20 bg-[#7A5AF8] shadow-[inset_0_3px_3px_rgba(255,255,255,0.40),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)] text-white font-medium transition-all duration-200 hover:opacity-90 text-[16px] disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? (
                <>
                  <Loader2 size={16} className='animate-spin' />
                  Registering...
                </>
              ) : (
                <>
                  <CircleCheckBig size={16} /> Complete Registration
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
