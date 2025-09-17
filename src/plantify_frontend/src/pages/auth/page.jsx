import {
  Fingerprint,
  Smartphone,
  KeyRound,
  UserX,
  CircleOff,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginRequired() {
  const { signIn, isLoading, userType, isRegistered, isAuthenticated } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  // Handle redirect after successful authentication
  useEffect(() => {
    if (isAuthenticated && !isLoading && !isSigningIn) {
      if (isRegistered && userType) {
        if (userType === 'investor') {
          navigate('/investor');
        } else if (userType === 'founder') {
          navigate('/founder');
        } else {
          navigate('/onboarding');
        }
      } else {
        navigate('/onboarding');
      }
    }
  }, [isAuthenticated, isLoading, isRegistered, userType, isSigningIn, navigate]);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn();
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-purple-50 px-4'>
      <div>
        {/* Logo */}
        <div className='flex justify-center mb-4'>
          <img
            src='/assets/images/company-logo.png'
            alt='Plantify'
            className='h-12'
          />
        </div>
      </div>

      <div className='w-full max-w-md bg-white rounded-2xl shadow-2xl p-4'>
        <div className='flex flex-col gap-3 mb-8 mt-4'>
          <h2 className='text-center text-4xl font-ibm text-gray-900'>
            Login Required
          </h2>
          <p className='mt-1 text-center text-sm text-gray-600 font-geist'>
            To invest in startups, you need to authenticate with ID.ai and
            set up an investor account.
          </p>
        </div>

        <div className='bg-neutral-100 rounded-[16px] p-4 sm:p-4'>
          <div className='space-y-3 text-sm text-gray-700'>
            <div className='flex items-center gap-2'>
              <Fingerprint size={16} className='text-gray-500' />
              <span>WebAuthn-based security</span>
            </div>
            <div className='flex items-center gap-2'>
              <Smartphone size={16} className='text-gray-500' />
              <span>Register multiple devices</span>
            </div>
            <div className='flex items-center gap-2'>
              <KeyRound size={16} className='text-gray-500' />
              <span>Unique identity for each app</span>
            </div>
            <div className='flex items-center gap-2'>
              <UserX size={16} className='text-gray-500' />
              <span>No usernames or passwords</span>
            </div>
          </div>

          <div className='mt-6 space-y-3'>
            <button
              onClick={handleSignIn}
              disabled={isSigningIn || isLoading}
              className='w-full flex items-center justify-center gap-[6px] 
             px-4 py-3 rounded-xl 
             border border-white/20 
             bg-purple-500 
             text-white font-medium 
             shadow-[0_2px_4px_rgba(0,0,0,0.16),inset_0_3px_3px_rgba(255,255,255,0.40),inset_0_-2px_1px_rgba(0,0,0,0.25)] 
             hover:bg-purple-600 transition text-[16px]
             disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <Fingerprint size={16} />
              {isSigningIn ? 'Authenticating...' : 'Sign In with ID.ai'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSigningIn || isLoading}
              className='w-full flex items-center justify-center gap-[6px] 
             px-4 py-3 rounded-xl 
             border border-[#E5E5E5] 
             bg-[#F5F5F5] text-gray-700 font-medium 
             shadow-[inset_0_3px_3px_rgba(255,255,255,0.40),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)] 
             hover:bg-gray-100 transition text-[16px]
             disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <CircleOff size={16} />
              Cancel
            </button>
          </div>

          <p className='mt-4 text-center text-xs text-gray-500'>
            By authenticating with ID.ai, you agree to our{' '}
            <a href='#' className='underline hover:text-gray-700'>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href='#' className='underline hover:text-gray-700'>
              Privacy Policy
            </a>
            .
          </p>
          <p className='mt-2 text-center text-xs text-gray-500'>
            New to ID.ai?{' '}
            <a href='https://id.ai' target='_blank' rel='noopener noreferrer' className='underline hover:text-gray-700'>
              Learn more
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
