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
} from 'lucide-react';
import { Navbar, Footer } from '../../../components';
import PersonalInformationForm from './components/PersonalInformationForm';
import ProfessionalBackgroundForm from './components/ProfessionalBackgroundForm';
import VerificationDocumentsForm from './components/VerificationDocumentsForm';
import TermsAgreementForm from './components/TermsAgreementForm';
import { backendService } from '../../../lib/backend';
import { useAuth } from '../../../contexts/AuthContext';

export default function RegisterFounder() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, getIdentity } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const [formData, setFormData] = useState({
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

  const tabs = [
    {
      id: 1,
      label: 'Personal Information',
      icon: <User className='w-4 h-4' />,
    },
    {
      id: 2,
      label: 'Professional Background',
      icon: <Briefcase className='w-4 h-4' />,
    },
    { id: 3, label: 'Verification', icon: <CheckCircle className='w-4 h-4' /> },
    {
      id: 4,
      label: 'Terms & Agreement',
      icon: <FileText className='w-4 h-4' />,
    },
  ];

  useEffect(() => {
    if (success) {
      navigate('/founder');
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

  const nextStep = () => {
    if (step < tabs.length) {
      setStep(step + 1);
      setError(null); // Clear error when moving to next step
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null); // Clear error when moving to previous step
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
  };

  const handleDismissError = () => {
    setError(null);
  };

  const validateFormData = () => {
    const errors = [];

    if (!formData.fullName?.trim()) errors.push('Full name is required');
    if (!formData.email?.trim()) errors.push('Email is required');
    if (!formData.phone?.trim()) errors.push('Phone number is required');
    if (!formData.address?.trim()) errors.push('Address is required');
    if (!formData.idNumber?.trim()) errors.push('ID number is required');
    if (!formData.taxNumber?.trim()) errors.push('Tax number is required');

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    return errors;
  };

  const handleSubmit = async () => {
    try {
      if (!isAuthenticated) {
        setError('Please authenticate first before registering.');
        return;
      }

      const identity = getIdentity();
      if (!identity) {
        setError('Identity not available. Please sign in again.');
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

      await backendService.initialize(identity);

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

      const result = await backendService.registerFounder(founderRequest);

      if ('ok' in result && result.ok) {
        setSuccess(true);
      } else if ('err' in result && result.err) {
        setError(result.err);
      } else {
        setError('Unexpected response format from backend');
      }
    } catch (err) {
      let errorMessage = 'Registration failed. Please try again.';

      if (err.message) {
        if (
          err.message.includes('Canister') &&
          err.message.includes('does not belong to any subnet')
        ) {
          errorMessage =
            'Cannot connect to the backend canister. Please ensure you are using the correct canister ID.';
        } else if (err.message.includes('Invalid principal')) {
          errorMessage =
            'Authentication error. Please sign in again and try once more.';
        } else if (err.message.includes('timeout')) {
          errorMessage =
            'Connection to Internet Computer timed out. Please try again later.';
        } else if (err.message.includes('Network')) {
          errorMessage =
            'Network error. Please check your internet connection and try again.';
        } else if (err.message.includes('Failed to fetch')) {
          errorMessage =
            'Failed to connect to the server. Please check your internet connection and try again.';
        } else if (err.message.includes('User rejected')) {
          errorMessage =
            'Transaction was rejected. Please try again and approve the transaction.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className='bg-gray-50 text-gray-900 min-h-screen'>
      <Navbar />

      <div className='max-w-7xl mx-auto mt-8 mb-8'>
        {/* Error Message */}
        {error && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
            <div className='flex items-start gap-3'>
              <AlertCircle className='w-5 h-5 text-red-500 flex-shrink-0 mt-0.5' />
              <div className='flex-1'>
                <div className='text-red-700 text-sm mb-3'>{error}</div>
                <div className='flex gap-3'>
                  <button
                    onClick={handleRetry}
                    className='bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors'
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleDismissError}
                    className='bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors'
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
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
            <ProfessionalBackgroundForm
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {step === 3 && (
            <VerificationDocumentsForm
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
