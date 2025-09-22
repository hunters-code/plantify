import { useState, useEffect } from 'react';

import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Tabs from '../../../components/layout/Tabs';
import DashboardOverview from './partial/DashboardOverview';
import Teams from './partial/Teams';
import FoundingStatus from './partial/FoundingStatus';
import StartupOverview from './partial/StartupOverview';
import MonthlyReports from './partial/MonthlyReports';
import ProfitSharing from './partial/ProfitSharing';
import Investors from './partial/Investors';
import Collateral from './partial/Collateral';
import { Button, Select } from '../../../components/ui';
import { useFounderStartups } from '../../../hooks/useFounderStartups';
import {
  CirclePlus,
  FileChartLine,
  FileText,
  HandCoins,
  Users,
} from 'lucide-react';

export default function Dashboard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  const { startups, loading: startupsLoading, error: startupsError } = useFounderStartups();

  useEffect(() => {
    if (startups.length > 0 && !selectedCompany) {
      setSelectedCompany(startups[0].id);
    }
  }, [startups, selectedCompany]);
  const tabs = [
    { label: 'Overview', icon: <FileChartLine size={16} /> },
    { label: 'Team', icon: <Users size={16} /> },
    { label: 'Funding status', icon: <HandCoins size={16} /> },
    { label: 'Monthly reports', content: <div>Reports content</div> },
    { label: 'Profit sharing', content: <div>Profit sharing content</div> },
    { label: 'Collateral', content: <div>Collateral content</div> },
    { label: 'Investors', content: <div>Investors content</div> },
  ];

  const selectedStartup = startups.find(startup => startup.id === selectedCompany);

  const renderContent = () => {
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

  return (
    <div className='bg-gray-50 min-h-screen text-gray-900'>
      <Navbar />

      <main className='max-w-6xl mx-auto px-6 py-10'>
        <h1 className='text-2xl font-semibold mb-6 font-ibm'>
          Dashboard Overview
        </h1>
        <DashboardOverview />

        <div className='mt-10'>
          <div className='flex justify-between mb-3'>
            <h2 className='text-2xl font-semibold mb-4 font-ibm'>
              Your Startups
            </h2>
            <Button variant='primary'>
              <CirclePlus size={16} />
              Create new startup
            </Button>
          </div>

          {startups.length > 0 && (
            <div className='w-64 mb-4'>
              <Select
                value={selectedCompany || ''}
                onChange={e => setSelectedCompany(e.target.value)}
                options={startups.map(startup => ({
                  value: startup.id,
                  label: startup.startupName || `Startup ${startup.id}`
                }))}
                className='bg-[#FAFAFA] border-[#E5E5E5]'
                disabled={startupsLoading}
              />
            </div>
          )}
          
          {startupsLoading && (
            <div className='w-64 mb-4'>
              <div className='h-10 bg-gray-200 rounded animate-pulse'></div>
            </div>
          )}
          
          {startupsError && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600'>
              Error loading startups: {startupsError}
            </div>
          )}
          
          {!startupsLoading && !startupsError && startups.length === 0 && (
            <div className='mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-600'>
              No startups found. Create your first startup to get started.
            </div>
          )}

          <Tabs tabs={tabs} onChange={setActiveTab} />

          <div className='rounded-2xl shadow-sm'>{renderContent()}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
