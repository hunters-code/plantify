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
import { Button, Card } from '../../components/ui';

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

      <Card className='w-full max-w-md shadow-2xl p-4'>
        <div className='flex flex-col gap-3 mb-8 mt-4'>
          <h2 className='text-center text-4xl font-ibm text-gray-900'>
            Login Required
          </h2>
          <p className='mt-1 text-center text-sm text-gray-600 font-geist'>
            To invest in startups, you need to authenticate with ID.ai and
            set up an investor account.
          </p>
        </div>

        <Card className='bg-neutral-100 p-4 sm:p-4'>
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
            <Button
              onClick={handleSignIn}
              disabled={isSigningIn || isLoading}
              variant='primary'
              className='w-full bg-purple-500 hover:bg-purple-600'
            >
              <Fingerprint size={16} />
              {isSigningIn ? 'Authenticating...' : 'Sign In with ID.ai'}
            </Button>
            <Button
              onClick={handleCancel}
              disabled={isSigningIn || isLoading}
              variant='secondary'
              className='w-full'
            >
              <CircleOff size={16} />
              Cancel
            </Button>
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
        </Card>
      </Card>
    </div>
  );
}
