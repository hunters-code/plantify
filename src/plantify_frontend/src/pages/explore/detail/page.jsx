'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Banknote,
  BanknoteArrowUp,
  BarChart3,
  ChartCandlestick,
  Eye,
  FileText,
  FolderOpen,
  GalleryHorizontalEnd,
  Sparkle,
  ThumbsUp,
  Users,
} from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Tabs from '../../../components/layout/Tabs';
import { Badge, Button, Card, ImageGallery, ProgressBar } from '../../../components/ui';

// partials
import Overview from './partial/Overview';
import Financials from './partial/Financials';
import FounderTeam from './partial/FounderTeam';
import Documents from './partial/Documents';
import Risks from './partial/Risks';

export default function ExploreDetail() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Overview', icon: <FileText size={16} /> },
    { label: 'Financials', icon: <BarChart3 size={16} /> },
    { label: 'Founder & Team', icon: <Users size={16} /> },
    { label: 'Documents', icon: <FolderOpen size={16} /> },
    { label: 'Risks', icon: <AlertTriangle size={16} /> },
  ];

  const images = [
    '/assets/images/product.png',
    '/assets/images/product.png',
    '/assets/images/product.png',
    '/assets/images/product.png',
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <Overview />;
      case 1:
        return <Financials />;
      case 2:
        return <FounderTeam />;
      case 3:
        return <Documents />;
      case 4:
        return <Risks />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className='bg-gray-50 text-gray-900 min-h-screen'>
      <Navbar />

      <div className='max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Left Side (Images) */}
        <ImageGallery
          images={images}
          showViewMore={true}
          onViewMore={() => console.log('View more clicked')}
        />

        {/* Right Side (Detail Card) */}
        <Card className='bg-neutral-100 flex flex-col gap-4'>
          {/* Tags */}
          <div className='flex gap-2'>
            <Badge variant='primary' icon={<ThumbsUp size={16} />}>
              Featured
            </Badge>
            <Badge variant='success'>
              Agriculture
            </Badge>
            <Badge variant='warning'>
              Moderate Risk
            </Badge>
          </div>

          {/* Title & Desc */}
          <div className='flex gap-3'>
            <div>
              <img src='/assets/images/icon-startup.png' className='w-8 h-8' />
            </div>
            <h2 className='text-2xl font-semibold font-ibm'>
              EcoFarm Solutions
            </h2>
          </div>
          <p className='text-gray-600 text-sm'>
            Revolutionary organic farming solutions using sustainable technology
            to maximize crop yields while maintaining environmental balance.
          </p>
          <p className='text-sm text-gray-500 border border-neutral-200 w-fit rounded-full px-2 py-1'>
            📍 Bandung, Indonesia · 12 employees
          </p>

          {/* Stats */}
          <div className='space-y-2 text-sm'>
            <p className='flex gap-2 items-center'>
              <ChartCandlestick size={20} className='text-neutral-500' />{' '}
              Periodic Returns: <span className='font-semibold'>$12</span>
            </p>
            <p className='flex gap-2 items-center'>
              <BanknoteArrowUp size={20} className='text-neutral-500' /> Annual
              ROI: <span className='font-semibold'>19.2%</span>
            </p>
            <p className='flex gap-2 items-center'>
              <GalleryHorizontalEnd size={20} className='text-neutral-500' />{' '}
              Available: <span className='font-semibold'>167 NFT</span>
            </p>
            <p className='flex gap-2 items-center'>
              <Sparkle size={20} className='text-neutral-500' /> Funding
              Progress:{' '}
              <span className='text-orange-500 font-semibold'>45% Funded</span>
            </p>
            <ProgressBar
              value={45}
              max={100}
              color='bg-orange-500'
              showValue={false}
            />
          </div>

          {/* Target */}
          <div className='flex justify-between items-center text-sm'>
            <span className='text-orange-600 font-semibold'>$22,500</span>
            <span className='text-gray-400'>$50,000</span>
          </div>

          <Card className='p-4 border border-neutral-500'>
            {/* NFT Price */}
            <div className='text-sm'>
              NFT Price: <span className='font-semibold'>$75 cKUSDC</span>
            </div>

            {/* Button */}
            <Button
              variant='primary'
              className='w-full mt-3'
            >
              <Banknote size={20} /> Invest Now
            </Button>
          </Card>
        </Card>
      </div>

      <div className='max-w-6xl mx-auto'>
        <div className='max-w-5xl px-6 py-10'>
          <div className='mt-4'>
            <Tabs tabs={tabs} onChange={setActiveTab} />
          </div>

          <div className='rounded-2xl shadow-sm'>{renderContent()}</div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
