import { useState } from 'react';

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
  const [selectedCompany, setSelectedCompany] = useState(1);
  const companies = [
    {
      id: 1,
      name: 'EcoFarm Solutions',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Eo_circle_green_letter-e.svg',
    },
    {
      id: 2,
      name: 'AgriSmart',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Bitmap_Verde.svg',
    },
  ];
  const tabs = [
    { label: 'Overview', icon: <FileChartLine size={16} /> },
    { label: 'Team', icon: <Users size={16} /> },
    { label: 'Funding status', icon: <HandCoins size={16} /> },
    { label: 'Monthly reports', content: <div>Reports content</div> },
    { label: 'Profit sharing', content: <div>Profit sharing content</div> },
    { label: 'Collateral', content: <div>Collateral content</div> },
    { label: 'Investors', content: <div>Investors content</div> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <StartupOverview />;
      case 1:
        return <Teams />;
      case 2:
        return <FoundingStatus />;
      case 3:
        return <MonthlyReports />;
      case 4:
        return <ProfitSharing />;
      case 5:
        return <Collateral />;
      case 6:
        return <Investors />;
      default:
        return <StartupOverview />;
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

          <div className='w-64 mb-4'>
            <Select
              value={selectedCompany}
              onChange={e => setSelectedCompany(Number(e.target.value))}
              options={companies.map(company => ({
                value: company.id,
                label: company.name
              }))}
              className='bg-[#FAFAFA] border-[#E5E5E5]'
            />
          </div>

          <Tabs tabs={tabs} onChange={setActiveTab} />

          <div className='rounded-2xl shadow-sm'>{renderContent()}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
