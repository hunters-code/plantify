import { useState, useEffect, useCallback } from 'react';
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
import { Navbar, Footer, Layout } from '../../../components';
import { Alert, Button, LoadingSpinner } from '../../../components/ui';
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
    initializeBackendActor,
  } = useRegistration();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const ensureBackendConnection = useCallback(async () => {
    if (!isAvailable) {
      try {
        const initialized = await initializeBackendActor();
        return initialized;
      } catch (error) {
        return false;
      }
    }
    return true;
  }, [isAvailable, initializeBackendActor]);

  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    city: '',

    investmentExperience: '',
    riskTolerance: '',
    investmentGoals: '',
    availableCapital: '',
    monthlyBudget: '',

    investmentRisks: false,
    nftModel: false,
    governance: false,
    liquidity: false,

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
    {
      id: 3,
      label: 'Knowladge Assessment',
      icon: <Brain className='w-4 h-4' />,
    },
    {
      id: 4,
      label: 'Terms & Agreement',
      icon: <FileText className='w-4 h-4' />,
    },
  ];

  useEffect(() => {
    if (success) {
      navigate('/investor?registered=true');
    }
  }, [success, navigate]);

  useEffect(() => {
    setError(null);
  }, [step]);
  useEffect(() => {
    if (!authLoading && isAuthenticated === false) {
      navigate('/auth');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      ensureBackendConnection()
        .then(success => {
          if (!success) {
            setTimeout(() => {
              ensureBackendConnection()
                .then(retrySuccess => {
                  if (!retrySuccess) {
                    console.warn(
                      'Failed to initialize backend connection after retry'
                    );
                  }
                })
                .catch(err => {
                  console.error(
                    'Error initializing backend connection on retry:',
                    err
                  );
                });
            }, 1000);
          }
        })
        .catch(err => {});
    }
  }, [isAuthenticated, ensureBackendConnection]);

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

  const validateForm = () => {
    const errors = [];

    if (!formData.fullName || formData.fullName.trim() === '') {
      errors.push('Full name is required');
    }
    if (!formData.email || formData.email.trim() === '') {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }
    if (!formData.phone || formData.phone.trim() === '') {
      errors.push('Phone number is required');
    }
    if (!formData.country || formData.country.trim() === '') {
      errors.push('Country is required');
    }
    if (!formData.city || formData.city.trim() === '') {
      errors.push('City is required');
    }

    if (!formData.investmentExperience) {
      errors.push('Investment experience level is required');
    }
    if (!formData.riskTolerance) {
      errors.push('Risk tolerance is required');
    }
    if (!formData.availableCapital) {
      errors.push('Available investment capital is required');
    }

    if (!formData.investmentRisks) {
      errors.push('You must acknowledge understanding investment risks');
    }
    if (!formData.nftModel) {
      errors.push(
        'You must acknowledge understanding the NFT investment model'
      );
    }

    if (!formData.terms || !formData.risks || !formData.transparency) {
      errors.push('You must agree to all terms and conditions');
    }

    return errors;
  };

  const handleSubmit = async () => {
    try {
      if (!isAuthenticated) {
        setError('Please authenticate first before registering.');
        return;
      }

      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        setError(validationErrors.join('. '));
        return;
      }

      const backendAvailable = await ensureBackendConnection();
      if (!backendAvailable) {
        setError(
          'Backend connection not available. Please ensure you are authenticated and the backend is running.'
        );
        return;
      }

      if (!isBackendDeclarationsAvailable()) {
        setError(
          'Failed to load backend declarations. Please ensure the backend is running and try again.'
        );
        return;
      }

      const investorData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        location: null,
        occupation: null,
        company: null,
        bio: '',
        profilePhoto: null,
        investmentExperience: formData.investmentExperience || 'beginner',
        riskTolerance: formData.riskTolerance || 'medium',
        investmentGoals: formData.investmentGoals || 'growth',
        availableCapital: formData.availableCapital || '1k_10k',
        monthlyBudget: formData.monthlyBudget || '0',
      };

      console.log('Submitting investor registration data:', investorData);

      try {
        const result = await registerInvestor(investorData);
        console.log('Registration result:', result);

        if (result.success) {
          console.log('Registration successful!');
        } else {
          console.error('Registration failed:', result.error);
          setError(result.error || 'Registration failed. Please try again.');
        }
      } catch (registrationError) {
        console.error('Registration error:', registrationError);
        setError(
          registrationError.message ||
            'Registration failed with an unexpected error.'
        );
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  if (authLoading) {
    return (
      <div className='bg-gray-50 text-gray-900 min-h-screen flex flex-col'>
        <Navbar />

        <div className='flex-1 flex flex-col items-center justify-center'>
          <LoadingSpinner size='xl' />
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className='max-w-7xl mx-auto mt-8 mb-8'>
        {/* Error Message */}
        {(error || hookError) && (
          <Alert type='error' message={error || hookError} className='mb-6' />
        )}

        {/* Authentication Status - only show if not authenticated */}
        {!isAuthenticated && (
          <Alert
            type='warning'
            message={
              <>
                Please authenticate first before registering.{' '}
                <a href='/auth' className='underline'>
                  Click here to sign in
                </a>
                .
              </>
            }
            className='mb-6'
          />
        )}

        {/* Backend Status - Only show when submitting form */}
        {error && error.includes('backend') && (
          <Alert
            type='info'
            message='Backend connection issue. The form will try to connect automatically when submitting.'
            className='mb-6'
          />
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
            <Button onClick={prevStep} variant='secondary'>
              <CircleArrowLeft size={16} /> Previous
            </Button>
          ) : (
            <div></div>
          )}

          {/* Next / Submit Button */}
          {step < tabs.length ? (
            <Button onClick={nextStep} disabled={loading} variant='primary'>
              Next <CircleArrowRight size={16} />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={
                loading ||
                !formData.terms ||
                !formData.risks ||
                !formData.transparency
              }
              variant='primary'
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
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
}
