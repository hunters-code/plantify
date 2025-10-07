'use client';

import {
  User,
  FileText,
  CircleArrowRight,
  CircleCheckBig,
  CircleArrowLeft,
  Loader2,
  Banknote,
  Brain,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import { Navbar, Footer, Layout } from '@/components';
import FormMultiStep, { Step } from '@/components/layout/FormMultiStep';
import { Alert, Button, LoadingSpinner } from '@/components/ui';

import InvestmentProfile from './partial/InvestmentProfile';
import KnowladgeAssessment from './partial/KnowladgeAssessment';
import PersonalInformationForm from './partial/PersonalInformationForm';
import TermsAgreementForm from './partial/TermsAgreementForm';

const navigate = (url: string) => console.log('Navigate to:', url);

const registerInvestor = async (data: any) => {
  console.log('Dummy register investor', data);
  return { success: true };
};
const loading = false;
const hookError = null;
const success = false;

// const { isAuthenticated, isLoading: authLoading } = useAuth();
const isAuthenticated = true;
const authLoading = false;
// -------------------------------------------------------

export default function RegisterInvestor() {
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
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
  }, [success]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => step < tabs.length && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);

  const handleSubmit = async () => {
    console.log('Submitting form:', formData);
    const result = await registerInvestor(formData);
    if (result.success) {
      console.log('Registration successful!');
    } else {
      setError('Registration failed!');
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
        {(error || hookError) && (
          <Alert
            type='error'
            message={error || hookError || ''}
            className='mb-6'
          />
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
              label: 'Knowladge Assessment',
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
            !formData.terms || !formData.risks || !formData.transparency
          }
        />
      </div>
    </Layout>
  );
}
