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
        <div>
          {/* Main Image */}
          <div className='rounded-xl overflow-hidden shadow-md'>
            <img
              src={images[activeIndex]}
              alt='Product'
              width={600}
              height={400}
              className='object-cover w-full h-[350px] transition-all duration-300'
            />
          </div>

          {/* Thumbnail List */}
          <div className='flex gap-3 mt-4'>
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-20 h-20 rounded-lg overflow-hidden shadow cursor-pointer border-2 transition-all duration-200 ${
                  activeIndex === i ? 'border-purple-500' : 'border-transparent'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${i}`}
                  width={80}
                  height={80}
                  className='object-cover w-full h-full'
                />
              </div>
            ))}

            <div className='relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer'>
              {/* Background Image */}
              <img
                src='/assets/images/product.png'
                alt='View More'
                className='object-cover w-full h-full'
              />

              {/* Overlay */}
              <div className='absolute inset-0 bg-purple-600 bg-opacity-70 flex flex-col items-center justify-center text-white font-medium'>
                <Eye size={16} />
                <span className='text-xs'>View More</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (Detail Card) */}
        <div className='bg-neutral-100 rounded-2xl p-6 flex flex-col gap-4'>
          {/* Tags */}
          <div className='flex gap-2'>
            <span className='bg-purple-100 text-purple-700 border border-purple-700 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-2'>
              <ThumbsUp size={16} />
              Featured
            </span>
            <span className='bg-green-100 text-green-700 border border-green-700 px-3 py-1 rounded-lg text-xs font-medium'>
              Agriculture
            </span>
            <span className='bg-yellow-100 text-yellow-700 border border-yellow-700 px-3 py-1 rounded-lg text-xs font-medium'>
              Moderate Risk
            </span>
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
            <div className='w-full bg-gray-200 h-2 rounded-full'>
              <div className='bg-orange-500 h-2 rounded-full w-[45%]' />
            </div>
          </div>

          {/* Target */}
          <div className='flex justify-between items-center text-sm'>
            <span className='text-orange-600 font-semibold'>$22,500</span>
            <span className='text-gray-400'>$50,000</span>
          </div>

          <div className='p-4 border border-netural-500 rounded-[16px]'>
            {/* NFT Price */}
            <div className='text-sm'>
              NFT Price: <span className='font-semibold'>$75 cKUSDC</span>
            </div>

            {/* Button */}
            <button
              className='w-full mt-3 flex justify-center items-center gap-[6px] px-4 py-3 
             rounded-[12px] border border-white/20 bg-[#7A5AF8] 
             shadow-[0_2px_4px_rgba(0,0,0,0.16),inset_0_3px_3px_rgba(255,255,255,0.40),inset_0_-2px_1px_rgba(0,0,0,0.25)] 
             text-white font-medium transition-all duration-200 hover:opacity-90 text-[16px]'
            >
              <Banknote size={20} /> Invest Now
            </button>
          </div>
        </div>
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
