'use client';

import {
  CirclePlus,
  FileChartLine,
  HandCoins,
  Users,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Layout } from '@/components';
import Tabs from '@/components/layout/Tabs';
import { Button, Select, Alert } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { FounderService } from '@/services/founders/FounderService';

import Collateral from './partial/Collateral';
import DashboardOverview from './partial/DashboardOverview';
import FoundingStatus from './partial/FoundingStatus';
import Investors from './partial/Investors';
import MonthlyReports from './partial/MonthlyReports';
import ProfitSharing from './partial/ProfitSharing';
import StartupOverview from './partial/StartupOverview';
import Teams from './partial/Teams';

// Use the return type from FounderService instead of importing types
type Startup = Awaited<
  ReturnType<typeof FounderService.getFounderStartups>
>[number];

export default function Dashboard() {
  const navigate = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [startupsLoading, setStartupsLoading] = useState(true);
  const [startupsError, setStartupsError] = useState<string | null>(null);
  const [isFounder, setIsFounder] = useState(false);

  // Check if user is authenticated and is a founder
  useEffect(() => {
    const checkFounder = async () => {
      if (!authLoading && !isAuthenticated) {
        navigate.push('/auth');
        return;
      }

      if (isAuthenticated) {
        try {
          const founder = await FounderService.getFounderByPrincipal();
          if (!founder) {
            navigate.push('/register/founder');
            return;
          }
          setIsFounder(true);
        } catch (error) {
          console.error('Error checking founder status:', error);
          setStartupsError('Failed to verify founder status');
        }
      }
    };

    checkFounder();
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch founder's startups
  useEffect(() => {
    const fetchStartups = async () => {
      if (!isFounder) return;

      try {
        setStartupsLoading(true);
        setStartupsError(null);

        const founderStartups = await FounderService.getFounderStartups();
        setStartups(founderStartups);

        if (founderStartups.length > 0 && !selectedCompany) {
          setSelectedCompany(founderStartups[0].id);
        }
      } catch (error) {
        console.error('Error fetching startups:', error);
        setStartupsError('Failed to load startups. Please try again.');
      } finally {
        setStartupsLoading(false);
      }
    };

    fetchStartups();
  }, [isFounder, selectedCompany]);

  const tabs = [
    { label: 'Overview', icon: <FileChartLine size={16} /> },
    { label: 'Team', icon: <Users size={16} /> },
    { label: 'Funding status', icon: <HandCoins size={16} /> },
    { label: 'Monthly reports', icon: <FileChartLine size={16} /> },
    { label: 'Profit sharing', icon: <FileChartLine size={16} /> },
    { label: 'Collateral', icon: <FileChartLine size={16} /> },
    { label: 'Investors', icon: <FileChartLine size={16} /> },
  ];

  const selectedStartup = startups.find(
    startup => startup.id === selectedCompany
  );

  const handleCreateStartup = () => {
    navigate.push('/startup/create');
  };

  const handleRefresh = async () => {
    if (!isFounder) return;

    try {
      setStartupsLoading(true);
      setStartupsError(null);

      const founderStartups = await FounderService.getFounderStartups();
      setStartups(founderStartups);

      if (
        !founderStartups.find(s => s.id === selectedCompany) &&
        founderStartups.length > 0
      ) {
        setSelectedCompany(founderStartups[0].id);
      }
    } catch (error) {
      console.error('Error refreshing startups:', error);
      setStartupsError('Failed to refresh startups. Please try again.');
    } finally {
      setStartupsLoading(false);
    }
  };

  const renderContent = () => {
    if (!selectedCompany) {
      return (
        <div className='p-8 text-center text-gray-500'>
          <p>Please select a startup to view details</p>
        </div>
      );
    }

    switch (activeTab) {
      case 0:
        return <StartupOverview startupId={selectedCompany} />;
      case 1:
        return <Teams startupId={selectedCompany} />;
      case 2:
        return <FoundingStatus startupId={selectedCompany} />;
      case 3:
        return <MonthlyReports startupId={selectedCompany} />;
      case 4:
        return <ProfitSharing startupId={selectedCompany} />;
      case 5:
        return <Collateral startupId={selectedCompany} />;
      case 6:
        return <Investors startupId={selectedCompany} />;
      default:
        return <StartupOverview startupId={selectedCompany} />;
    }
  };

  // Loading state
  if (authLoading || (isAuthenticated && !isFounder && !startupsError)) {
    return (
      <Layout>
        <main className='max-w-6xl mx-auto px-6 py-10'>
          <div className='flex items-center justify-center h-64'>
            <div className='text-center'>
              <Loader2
                size={48}
                className='text-purple-600 animate-spin mx-auto mb-4'
              />
              <p className='text-gray-600'>Loading dashboard...</p>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className='max-w-6xl mx-auto px-6 py-10'>
        <h1 className='text-2xl font-semibold mb-6 font-ibm'>
          Dashboard Overview
        </h1>
        <DashboardOverview />

        <div className='mt-10'>
          <div className='flex justify-between items-center mb-3'>
            <h2 className='text-2xl font-semibold font-ibm'>Your Startups</h2>
            <div className='flex gap-3'>
              {startups.length > 0 && (
                <Button
                  variant='secondary'
                  onClick={handleRefresh}
                  disabled={startupsLoading}
                >
                  {startupsLoading ? (
                    <>
                      <Loader2 size={16} className='animate-spin' />
                      Refreshing...
                    </>
                  ) : (
                    'Refresh'
                  )}
                </Button>
              )}
              <Button variant='primary' onClick={handleCreateStartup}>
                <CirclePlus size={16} />
                Create new startup
              </Button>
            </div>
          </div>

          {startupsError && (
            <Alert type='error' message={startupsError} className='mb-4'>
              <Button
                onClick={handleRefresh}
                variant='secondary'
                className='mt-3'
              >
                Try Again
              </Button>
            </Alert>
          )}

          {startupsLoading && (
            <div className='mb-4'>
              <div className='h-10 bg-gray-200 rounded animate-pulse w-64'></div>
            </div>
          )}

          {!startupsLoading && !startupsError && startups.length === 0 && (
            <Alert
              type='warning'
              message='No startups found. Create your first startup to get started.'
              className='mb-4'
            >
              <Button
                onClick={handleCreateStartup}
                variant='primary'
                className='mt-3'
              >
                <CirclePlus size={16} />
                Create Your First Startup
              </Button>
            </Alert>
          )}

          {!startupsLoading && !startupsError && startups.length > 0 && (
            <>
              <div className='mb-4'>
                <Select
                  value={selectedCompany ?? ''}
                  onChange={e => setSelectedCompany(e.target.value)}
                  options={startups.map(startup => ({
                    value: startup.id,
                    label: startup.startupName || `Startup ${startup.id}`,
                  }))}
                  placeholder='Select a startup'
                  className='bg-[#FAFAFA] border-[#E5E5E5] max-w-xs'
                />
                {selectedStartup && (
                  <p className='text-sm text-gray-600 mt-2'>
                    {startups.length} startup{startups.length !== 1 ? 's' : ''}{' '}
                    found
                  </p>
                )}
              </div>

              <Tabs tabs={tabs} onChange={setActiveTab} activeTab={activeTab} />

              <div className='rounded-2xl mt-4'>
                {renderContent()}
              </div>
            </>
          )}
        </div>
      </main>
    </Layout>
  );
}
