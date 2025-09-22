import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { backendService } from '../lib/backend';
import { useAuth } from './useAuth';

export function useUserNavigation() {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setUserType(null);
      setLoading(false);
      return;
    }

    const detectUserType = async () => {
      try {
        setLoading(true);
        const userTypeResult = await backendService.getUserType();
        setUserType(userTypeResult);
      } catch (error) {
        console.error('Error detecting user type:', error);
        setUserType(null);
      } finally {
        setLoading(false);
      }
    };

    detectUserType();
  }, [isAuthenticated]);

  const getDashboardPath = () => {
    if (!userType) return '/onboarding';
    
    switch (userType) {
      case 'Founder':
        return '/founder/dashboard';
      case 'Investor':
        return '/investor';
      default:
        return '/onboarding';
    }
  };

  const getDashboardLabel = () => {
    if (!userType) return 'Dashboard';
    
    switch (userType) {
      case 'Founder':
        return 'Founder Dashboard';
      case 'Investor':
        return 'Investor Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const navigateToDashboard = () => {
    const dashboardPath = getDashboardPath();
    navigate(dashboardPath);
  };

  const navigateToExplore = () => {
    navigate('/explore');
  };

  const navigateToCreateStartup = () => {
    navigate('/startup/create');
  };

  const navigateToRegister = (type) => {
    navigate(`/register/${type}`);
  };

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getNavigationItems = () => {
    const baseItems = [
      { label: 'Explore Startups', path: '/explore', onClick: navigateToExplore },
      { label: 'How it Works', path: '#how', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
      { label: 'About', path: '#about', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    ];

    if (isAuthenticated && userType) {
      baseItems.push({
        label: getDashboardLabel(),
        path: getDashboardPath(),
        onClick: navigateToDashboard,
        isDashboard: true
      });

      if (userType === 'Founder') {
        baseItems.push({
          label: 'Create Startup',
          path: '/startup/create',
          onClick: navigateToCreateStartup
        });
      }
    } else if (isAuthenticated && !userType) {
      baseItems.push({
        label: 'Complete Registration',
        path: '/onboarding',
        onClick: () => navigate('/onboarding')
      });
    } else {
      baseItems.push({
        label: 'For Founders',
        path: '#founders',
        onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' })
      });
    }

    return baseItems;
  };

  return {
    userType,
    loading,
    getDashboardPath,
    getDashboardLabel,
    navigateToDashboard,
    navigateToExplore,
    navigateToCreateStartup,
    navigateToRegister,
    isActivePath,
    getNavigationItems
  };
}
