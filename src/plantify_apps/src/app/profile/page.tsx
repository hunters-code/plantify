'use client';

import { useState } from 'react';
import { BanknoteArrowUp, CreditCard, IdCard, WalletCards } from 'lucide-react';

import ProfileInvestor from './partial/ProfileInvestor';
import Investment from './partial/Investment';
import Portfolio from './partial/Portfolio';
import Wallet from './partial/Wallet';

import { Layout } from '@/components';
import Tabs from '@/components/layout/Tabs';

export default function Profile() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Profile', icon: <IdCard size={16} /> },
    { label: 'Investment', icon: <BanknoteArrowUp size={16} /> },
    { label: 'Portfolio', icon: <WalletCards size={16} /> },
    { label: 'Wallet', icon: <CreditCard size={16} /> },
  ];

  return (
    <Layout>
      <div className='max-w-6xl mx-auto px-6 py-10'>
        <Tabs tabs={tabs} onChange={setActiveTab} activeTab={activeTab} />
        <div className='mt-8'>
          {activeTab === 0 && <ProfileInvestor />}
          {activeTab === 1 && <Investment />}
          {activeTab === 2 && <Portfolio />}
          {activeTab === 3 && <Wallet />}
        </div>
      </div>
    </Layout>
  );
}
