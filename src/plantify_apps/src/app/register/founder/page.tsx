'use client';

import { User, Briefcase, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Navbar, Footer } from '@/components';
import FormMultiStep from '@/components/layout/FormMultiStep';
import { Alert, Button } from '@/components/ui';
import { FounderService } from '@/services/founders';

import PersonalInformationForm from './partial/PersonalInformationForm';
import ProfessionalBackgroundForm from './partial/ProfessionalBackgroundForm';
import TermsAgreementForm from './partial/TermsAgreementForm';
import VerificationDocumentsForm from './partial/VerificationDocumentsForm';

const useAuth = () => ({
  isAuthenticated: true,
  isLoading: false,
  getIdentity: () => ({ userId: 'dummy-user' }),
});

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
  previousBusinesses: string;
  expertise: string;
  linkedIn: string;
  idNumber: string;
  taxNumber: string;
  terms: boolean;
  risks: boolean;
  transparency: boolean;
  governmentIdFile?: File;
  taxIdFile?: File;
}

export default function RegisterFounder() {
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
    address: '',
    experience: '',
    previousBusinesses: '',
    expertise: '',
    linkedIn: '',
    idNumber: '',
    taxNumber: '',
    terms: false,
    risks: false,
    transparency: false,
  });

  useEffect(() => {
    if (success) navigate.push('/founder');
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
    const checkExistingFounder = async () => {
      if (isAuthenticated) {
        try {
          const existingFounder = await FounderService.getFounderByPrincipal();
          if (existingFounder) {
            navigate.push('/founder');
          }
        } catch (err) {
          console.error('Error checking existing founder:', err);
        }
      }
    };

    checkExistingFounder();
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
  };

  const handleDismissError = () => setError(null);

  const validateFormData = (): string[] => {
    const errors: string[] = [];
    if (!formData.fullName?.trim()) errors.push('Full name is required');
    if (!formData.email?.trim()) errors.push('Email is required');
    if (!formData.phone?.trim()) errors.push('Phone number is required');
    if (!formData.address?.trim()) errors.push('Address is required');
    if (!formData.idNumber?.trim()) errors.push('ID number is required');
    if (!formData.taxNumber?.trim()) errors.push('Tax number is required');
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }
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

      // Prepare founder registration request
      const founderRequest = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        experience: formData.experience?.trim() || '',
        previousBusinesses: formData.previousBusinesses?.trim() || '',
        expertise: formData.expertise?.trim() || '',
        linkedIn: formData.linkedIn?.trim() || '',
        idNumber: formData.idNumber.trim(),
        taxNumber: formData.taxNumber.trim(),
      };

      // Call FounderService to register founder
      const result = await FounderService.registerFounder(founderRequest);

      if (result.success) {
        setSuccess(true);
        // Will redirect via useEffect
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
    <div className='bg-gray-50 text-gray-900 min-h-screen'>
      <Navbar />

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
            message='Registration successful! Redirecting to your founder dashboard...'
            className='mb-6'
          />
        )}

        {/* Multi Step Form */}
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
              label: 'Professional Background',
              icon: <Briefcase className='w-4 h-4' />,
              content: (
                <ProfessionalBackgroundForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              ),
            },
            {
              id: 3,
              label: 'Verification',
              icon: <CheckCircle className='w-4 h-4' />,
              content: (
                <VerificationDocumentsForm
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
      <Footer />
    </div>
  );
}
