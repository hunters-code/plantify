'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import { backendService } from '../../../lib/backend';
import { useAuth } from '../../../contexts/AuthContext';

// partials
import Overview from './partial/Overview';
import Financials from './partial/Financials';
import FounderTeam from './partial/FounderTeam';
import Documents from './partial/Documents';
import Risks from './partial/Risks';

export default function ExploreDetail() {
  const { id } = useParams();
  const { getIdentity, isAuthenticated } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStartupDetails = async () => {
      if (!id) {
        setError('No startup ID provided');
        setLoading(false);
        return;
      }

      if (!isAuthenticated) {
        setError('Please sign in to view startup details');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const identity = getIdentity();
        if (!identity) {
          setError('Authentication required');
          setLoading(false);
          return;
        }
        
        // Initialize backend service if not already done
        if (!backendService.getActor()) {
          await backendService.initialize(identity);
        }
        
        console.log('Fetching startup details for ID:', id);
        const startupData = await backendService.getStartupDetails(id);
        console.log('Startup data received:', startupData);
        
        if (startupData) {
          setStartup(startupData);
        } else {
          setError('Startup not found');
        }
      } catch (err) {
        console.error('Error fetching startup details:', err);
        setError(`Failed to load startup details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStartupDetails();
  }, [id, isAuthenticated, getIdentity]);

  const tabs = [
    { label: 'Overview', icon: <FileText size={16} /> },
    { label: 'Financials', icon: <BarChart3 size={16} /> },
    { label: 'Founder & Team', icon: <Users size={16} /> },
    { label: 'Documents', icon: <FolderOpen size={16} /> },
    { label: 'Risks', icon: <AlertTriangle size={16} /> },
  ];

  // Use company images from startup data or fallback to default
  const images = startup?.companyImages?.length > 0 
    ? startup.companyImages 
    : ['/assets/images/product.png', '/assets/images/product.png', '/assets/images/product.png', '/assets/images/product.png'];

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <Overview startup={startup} />;
      case 1:
        return <Financials startup={startup} />;
      case 2:
        return <FounderTeam startup={startup} />;
      case 3:
        return <Documents startup={startup} />;
      case 4:
        return <Risks startup={startup} />;
      default:
        return <Overview startup={startup} />;
    }
  };

  if (loading) {
    return (
      <div className='bg-gray-50 text-gray-900 min-h-screen'>
        <Navbar />
        <div className='max-w-6xl mx-auto px-6 py-10 flex items-center justify-center min-h-[60vh]'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto'></div>
            <p className='mt-4 text-gray-600'>Loading startup details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className='bg-gray-50 text-gray-900 min-h-screen'>
        <Navbar />
        <div className='max-w-6xl mx-auto px-6 py-10 flex items-center justify-center min-h-[60vh]'>
          <div className='text-center'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Startup Not Found</h2>
            <p className='text-gray-600 mb-6'>{error || 'The startup you are looking for does not exist.'}</p>
            <button 
              onClick={() => window.history.back()}
              className='bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors'
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
            {startup.status === 'approved' && (
              <span className='bg-purple-100 text-purple-700 border border-purple-700 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-2'>
                <ThumbsUp size={16} />
                Featured
              </span>
            )}
            <span className='bg-green-100 text-green-700 border border-green-700 px-3 py-1 rounded-lg text-xs font-medium'>
              {startup.sector || 'Technology'}
            </span>
            <span className='bg-yellow-100 text-yellow-700 border border-yellow-700 px-3 py-1 rounded-lg text-xs font-medium'>
              {startup.status === 'approved' ? 'Low Risk' : 'Moderate Risk'}
            </span>
          </div>

          {/* Title & Desc */}
          <div className='flex gap-3'>
            <div>
              {startup.companyLogo && startup.companyLogo.length > 0 ? (
                <img src={startup.companyLogo[0]} className='w-8 h-8 rounded' alt='Company Logo' />
              ) : (
                <img src='/assets/images/icon-startup.png' className='w-8 h-8' alt='Default Logo' />
              )}
            </div>
            <h2 className='text-2xl font-semibold font-ibm'>
              {startup.startupName || 'Startup Name'}
            </h2>
          </div>
          <p className='text-gray-600 text-sm'>
            {startup.description || 'No description available.'}
          </p>
          <p className='text-sm text-gray-500 border border-neutral-200 w-fit rounded-full px-2 py-1'>
            📍 {startup.location || 'Location not specified'} · {startup.teamMembers?.length || 0} team members
          </p>

          {/* Stats */}
          <div className='space-y-2 text-sm'>
            <p className='flex gap-2 items-center'>
              <ChartCandlestick size={20} className='text-neutral-500' />{' '}
              Periodic Returns: <span className='font-semibold'>{startup.periodicProfitSharing || 'TBD'}</span>
            </p>
            <p className='flex gap-2 items-center'>
              <BanknoteArrowUp size={20} className='text-neutral-500' /> Monthly Revenue: <span className='font-semibold'>${startup.monthlyRevenue || '0'}</span>
            </p>
            <p className='flex gap-2 items-center'>
              <GalleryHorizontalEnd size={20} className='text-neutral-500' />{' '}
              NFT Price: <span className='font-semibold'>${startup.nftPrice || '0'}</span>
            </p>
            <p className='flex gap-2 items-center'>
              <Sparkle size={20} className='text-neutral-500' /> Funding Goal:{' '}
              <span className='text-orange-500 font-semibold'>${startup.fundingGoal || '0'}</span>
            </p>
          </div>

          {/* Target */}
          <div className='flex justify-between items-center text-sm'>
            <span className='text-gray-500'>Target:</span>
            <span className='text-orange-600 font-semibold'>${startup.fundingGoal || '0'}</span>
          </div>

          <div className='p-4 border border-netural-500 rounded-[16px]'>
            {/* NFT Price */}
            <div className='text-sm'>
              NFT Price: <span className='font-semibold'>${startup.nftPrice || '0'} ckUSDC</span>
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
