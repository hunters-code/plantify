'use client';

import { User, FileText, Loader2, Banknote, Brain } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Navbar, Footer, Layout } from '@/components';
import FormMultiStep from '@/components/layout/FormMultiStep';
import { Alert, Button, LoadingSpinner } from '@/components/ui';
import { InvestorService } from '@/services/investors';

import InvestmentProfile from './partial/InvestmentProfile';
import KnowladgeAssessment from './partial/KnowladgeAssessment';
import PersonalInformationForm from './partial/PersonalInformationForm';
import TermsAgreementForm from './partial/TermsAgreementForm';

const useAuth = () => ({
  isAuthenticated: true,
  isLoading: false,
  getIdentity: () => ({ userId: 'dummy-user' }),
});

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  investmentExperience: string;
  riskTolerance: string;
  investmentGoals: string;
  availableCapital: string;
  monthlyBudget: string;
  investmentRisks: boolean;
  nftModel: boolean;
  governance: boolean;
  liquidity: boolean;
  terms: boolean;
  risks: boolean;
  transparency: boolean;
}

export default function RegisterInvestor() {
  const navigate = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const [formData, setFormData] = useState<FormData>({
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

  useEffect(() => {
    if (success) {
      navigate.push('/investor?registered=true');
    }
  }, [success, navigate]);

  useEffect(() => {
    setError(null);
  }, [retryCount]);

  useEffect(() => {
    if (!authLoading && isAuthenticated === false) {
      navigate.push('/auth');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const checkExistingInvestor = async () => {
      if (isAuthenticated) {
        try {
          const existingInvestor =
            await InvestorService.getInvestorByPrincipal();
          if (existingInvestor) {
            navigate.push('/investor');
          }
        } catch (err) {
          console.error('Error checking existing investor:', err);
        }
      }
    };

    checkExistingInvestor();
  }, [isAuthenticated, navigate]);

  const handleInputChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (error) setError(null);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
  };

  const handleDismissError = () => setError(null);

  const validateFormData = (): string[] => {
    const errors: string[] = [];

    // Personal Information
    if (!formData.fullName?.trim()) errors.push('Full name is required');
    if (!formData.email?.trim()) errors.push('Email is required');
    if (!formData.phone?.trim()) errors.push('Phone number is required');
    if (!formData.country?.trim()) errors.push('Country is required');
    if (!formData.city?.trim()) errors.push('City is required');

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Investment Profile
    if (!formData.investmentExperience?.trim())
      errors.push('Investment experience is required');
    if (!formData.riskTolerance?.trim())
      errors.push('Risk tolerance is required');
    if (!formData.investmentGoals?.trim())
      errors.push('Investment goals are required');
    if (!formData.availableCapital?.trim())
      errors.push('Available capital is required');
    if (!formData.monthlyBudget?.trim())
      errors.push('Monthly budget is required');

    // Knowledge Assessment
    if (!formData.investmentRisks)
      errors.push('You must acknowledge investment risks');
    if (!formData.nftModel) errors.push('You must understand the NFT model');
    if (!formData.governance)
      errors.push('You must understand governance structure');
    if (!formData.liquidity) errors.push('You must understand liquidity terms');

    // Terms & Agreements
    if (!formData.terms)
      errors.push('You must accept the terms and conditions');
    if (!formData.risks) errors.push('You must acknowledge the risks');
    if (!formData.transparency)
      errors.push('You must agree to transparency requirements');

    return errors;
  };

  const handleSubmit = async () => {
    try {
      if (!isAuthenticated) {
        setError('Please authenticate first before registering.');
        return;
      }

      const validationErrors = validateFormData();
      if (validationErrors.length > 0) {
        setError(validationErrors.join('; '));
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      const investorRequest = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        country: formData.country.trim(),
        city: formData.city.trim(),
        location: [''] as [string],
        occupation: [''] as [string],
        company: [''] as [string],
        bio: [''] as [string],
        profilePhoto: [''] as [string],
        investmentExperience: formData.investmentExperience.trim(),
        riskTolerance: formData.riskTolerance.trim(),
        investmentGoals: formData.investmentGoals.trim(),
        availableCapital: formData.availableCapital.trim(),
        monthlyBudget: formData.monthlyBudget.trim(),
      };

      const result = await InvestorService.registerInvestor(investorRequest);

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className='bg-gray-50 text-gray-900 min-h-screen flex flex-col'>
        <Navbar />
        <div className='flex-1 flex flex-col items-center justify-center'>
          <Loader2 size={48} className='text-purple-600 animate-spin' />
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className='max-w-7xl mx-auto mt-8 mb-8 px-4'>
        {error && (
          <Alert type='error' message={error} className='mb-6'>
            <div className='flex gap-3 mt-3'>
              <Button
                onClick={handleRetry}
                variant='secondary'
                className='bg-red-600 text-white hover:bg-red-700'
              >
                Try Again
              </Button>
              <Button onClick={handleDismissError} variant='secondary'>
                Dismiss
              </Button>
            </div>
          </Alert>
        )}

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

        {success && (
          <Alert
            type='success'
            message='Registration successful! Redirecting to your investor dashboard...'
            className='mb-6'
          />
        )}

        <FormMultiStep
          steps={[
            {
              id: 1,
              label: 'Personal Information',
              icon: <User className='w-4 h-4' />,
              content: (
                <PersonalInformationForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              ),
            },
            {
              id: 2,
              label: 'Investment Profile',
              icon: <Banknote className='w-4 h-4' />,
              content: (
                <InvestmentProfile
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              ),
            },
            {
              id: 3,
              label: 'Knowledge Assessment',
              icon: <Brain className='w-4 h-4' />,
              content: (
                <KnowladgeAssessment
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              ),
            },
            {
              id: 4,
              label: 'Terms & Agreement',
              icon: <FileText className='w-4 h-4' />,
              content: (
                <TermsAgreementForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              ),
            },
          ]}
          currentStep={step}
          onStepChange={setStep}
          onSubmit={handleSubmit}
          loading={loading}
          disableSubmit={
            !formData.terms ||
            !formData.risks ||
            !formData.transparency ||
            !formData.investmentRisks ||
            !formData.nftModel ||
            !formData.governance ||
            !formData.liquidity
          }
        />
      </div>
    </Layout>
  );
}
