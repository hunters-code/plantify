import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendService } from '../lib/backend';
import { useAuth } from './useAuth';

export function useInvestmentAuth() {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, getIdentity } = useAuth();
  const navigate = useNavigate();

  const checkInvestmentEligibility = async () => {
    if (!isAuthenticated) {
      // Redirect to auth page
      navigate('/auth');
      return { canInvest: false, reason: 'authentication_required' };
    }

    setLoading(true);
    try {
      const identity = getIdentity();
      if (!identity) {
        navigate('/auth');
        return { canInvest: false, reason: 'authentication_required' };
      }

      // Initialize backend service if not already done
      if (!backendService.getActor()) {
        await backendService.initialize(identity);
      }

      // Check if user is registered as investor
      const userType = await backendService.getUserType();
      
      if (!userType) {
        // User is not registered, redirect to onboarding
        navigate('/onboarding');
        return { canInvest: false, reason: 'registration_required' };
      }

      if (userType !== 'Investor') {
        // User is registered but not as investor
        return { 
          canInvest: false, 
          reason: 'not_investor',
          message: 'You need to be registered as an investor to make investments. Please complete investor registration first.'
        };
      }

      // User is authenticated and registered as investor
      return { canInvest: true, reason: 'eligible' };

    } catch (error) {
      console.error('Error checking investment eligibility:', error);
      return { 
        canInvest: false, 
        reason: 'error',
        message: 'Unable to verify investment eligibility. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  const handleInvestClick = async () => {
    const eligibility = await checkInvestmentEligibility();
    
    if (!eligibility.canInvest) {
      // Show appropriate message based on reason
      switch (eligibility.reason) {
        case 'authentication_required':
          // Navigation is already handled in checkInvestmentEligibility
          break;
        case 'registration_required':
          // Navigation is already handled in checkInvestmentEligibility
          break;
        case 'not_investor':
          alert(eligibility.message);
          break;
        case 'error':
          alert(eligibility.message);
          break;
        default:
          alert('Unable to proceed with investment. Please try again.');
      }
      return false;
    }

    return true; // User can proceed with investment
  };

  return {
    loading,
    handleInvestClick,
    checkInvestmentEligibility
  };
}
