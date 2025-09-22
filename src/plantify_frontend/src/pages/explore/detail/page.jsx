'use client';

import { useState, useEffect, useRef } from 'react';
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
import {
  Badge,
  Button,
  Card,
  ImageGallery,
  ProgressBar,
} from '../../../components/ui';
import { backendService } from '../../../lib/backend';
import { useAuth } from '../../../contexts/AuthContext';
import { useInvestmentAuth } from '../../../hooks/useInvestmentAuth';

// partials
import Overview from './partial/Overview';
import Financials from './partial/Financials';
import FounderTeam from './partial/FounderTeam';
import Documents from './partial/Documents';
import Risks from './partial/Risks';

export default function ExploreDetail() {
  const { id } = useParams();
  const { getIdentity, isAuthenticated, isLoading: authLoading } = useAuth();
  const { handleInvestClick, loading: investmentLoading } = useInvestmentAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(new Set()); // Track which IDs we've already fetched
  const isFetchingRef = useRef(false); // Track if we're currently fetching

  // Reset fetch tracking when ID changes
  useEffect(() => {
    fetchedRef.current.clear();
    isFetchingRef.current = false;
    setStartup(null);
    setError(null);
    setLoading(true);
  }, [id]);

  useEffect(() => {
    console.log(
      '🔄 useEffect triggered - id:',
      id,
      'isAuthenticated:',
      isAuthenticated,
      'authLoading:',
      authLoading
    );

    // Don't do anything if auth is still loading
    if (authLoading) {
      console.log('⏳ Auth still loading, waiting...');
      return;
    }

    const fetchStartupDetails = async () => {
      if (!id) {
        console.log('❌ No ID provided');
        setError('No startup ID provided');
        setLoading(false);
        return;
      }

      // Prevent concurrent fetches
      if (isFetchingRef.current) {
        return;
      }

      try {
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);

        // Try to fetch startup details
        // If user is authenticated, use authenticated backend service
        // If not authenticated, we'll need to implement a public endpoint or use mock data
        if (isAuthenticated) {
          const identity = getIdentity();
          if (identity) {
            // Initialize backend service if not already done
            if (!backendService.getActor()) {
              await backendService.initialize(identity);
            }

            const startupData = await backendService.getStartupDetails(id);
            if (startupData) {
              setStartup(startupData);
            } else {
              setError('Startup not found');
            }
          } else {
            setError('Authentication error');
          }
        } else {
          // For unauthenticated users, we'll use mock data for now
          // In a real implementation, you'd have a public API endpoint
          const mockStartup = {
            id: id,
            startupName: 'EcoFarm Solutions',
            description: 'Revolutionary hydroponic farming system using IoT technology to help farmers boost their yields while preserving the environment.',
            sector: 'Agriculture',
            status: 'approved',
            location: 'Bandung, Indonesia',
            teamMembers: [
              { name: 'Anya Rodriguez', role: 'CEO & Founder' },
              { name: 'Marcus Johnson', role: 'CTO' },
              { name: 'Lisa Chen', role: 'Head of Product' }
            ],
            companyImages: [
              '/assets/images/product.png',
              '/assets/images/product.png',
              '/assets/images/product.png',
              '/assets/images/product.png'
            ],
            companyLogo: ['/assets/images/icon-startup.png'],
            periodicProfitSharing: '15% annually',
            monthlyRevenue: '25,000',
            nftPrice: '500',
            fundingGoal: '100,000',
            foundedYear: '2023',
            companyType: 'Startup',
            targetMarket: 'Small to medium scale farmers',
            solution: 'IoT-enabled hydroponic systems with automated monitoring',
            problemStatement: 'Traditional farming methods are inefficient and environmentally harmful',
            revenueModel: 'Hardware sales + subscription services',
            competitiveAdvantage: 'AI-powered crop optimization and real-time monitoring',
            useOfFunds: 'Product development, market expansion, team hiring',
            marketingStrategy: 'Direct sales to farmers, partnerships with agricultural cooperatives',
            operationalProcess: 'Design, manufacture, install, and maintain hydroponic systems',
            monthlyExpenses: '15,000',
            founderBackground: '10+ years in agricultural technology',
            advisors: 'Industry experts in agriculture and technology',
            businessPlan: ['Detailed business plan available upon request'],
            financialProjections: ['5-year financial projections available'],
            legalDocuments: ['Legal documents available for review'],
            website: 'https://ecofarm.example.com'
          };
          setStartup(mockStartup);
        }
      } catch (err) {
        setError(`Failed to load startup details: ${err.message}`);
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    };

    // Fetch startup details if we have an ID and auth is not loading
    if (id && !authLoading) {
      const fetchKey = `${id}-${isAuthenticated || 'anonymous'}`;
      if (!fetchedRef.current.has(fetchKey)) {
        console.log('🎯 First time fetching this startup');
        fetchedRef.current.add(fetchKey);
        fetchStartupDetails();
      } else {
        console.log('🔄 Already fetched this startup, skipping');
        setLoading(false); // Make sure loading is false if we're skipping
      }
    } else {
      console.log('⏸️ Skipping fetch - missing ID or auth loading');
    }
  }, [id, isAuthenticated, authLoading]);

  const tabs = [
    { label: 'Overview', icon: <FileText size={16} /> },
    { label: 'Financials', icon: <BarChart3 size={16} /> },
    { label: 'Founder & Team', icon: <Users size={16} /> },
    { label: 'Documents', icon: <FolderOpen size={16} /> },
    { label: 'Risks', icon: <AlertTriangle size={16} /> },
  ];

  // Use company images from startup data or fallback to default
  const images =
    startup?.companyImages?.length > 0
      ? startup.companyImages
      : [
          '/assets/images/product.png',
          '/assets/images/product.png',
          '/assets/images/product.png',
          '/assets/images/product.png',
        ];

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
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              Startup Not Found
            </h2>
            <p className='text-gray-600 mb-6'>
              {error || 'The startup you are looking for does not exist.'}
            </p>
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
            <Badge variant='success'>Agriculture</Badge>
            <Badge variant='warning'>Moderate Risk</Badge>
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
                <img
                  src={startup.companyLogo[0]}
                  className='w-8 h-8 rounded'
                  alt='Company Logo'
                />
              ) : (
                <img
                  src='/assets/images/icon-startup.png'
                  className='w-8 h-8'
                  alt='Default Logo'
                />
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
            📍 {startup.location || 'Location not specified'} ·{' '}
            {startup.teamMembers?.length || 0} team members
          </p>

          {/* Stats */}
          <div className='space-y-2 text-sm'>
            <p className='flex gap-2 items-center'>
              <ChartCandlestick size={20} className='text-neutral-500' />{' '}
              Periodic Returns:{' '}
              <span className='font-semibold'>
                {startup.periodicProfitSharing || 'TBD'}
              </span>
            </p>
            <p className='flex gap-2 items-center'>
              <BanknoteArrowUp size={20} className='text-neutral-500' /> Monthly
              Revenue:{' '}
              <span className='font-semibold'>
                ${startup.monthlyRevenue || '0'}
              </span>
            </p>
            <p className='flex gap-2 items-center'>
              <GalleryHorizontalEnd size={20} className='text-neutral-500' />{' '}
              NFT Price:{' '}
              <span className='font-semibold'>${startup.nftPrice || '0'}</span>
            </p>
            <p className='flex gap-2 items-center'>
              <Sparkle size={20} className='text-neutral-500' /> Funding Goal:{' '}
              <span className='text-orange-500 font-semibold'>
                ${startup.fundingGoal || '0'}
              </span>
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
            <span className='text-gray-500'>Target:</span>
            <span className='text-orange-600 font-semibold'>
              ${startup.fundingGoal || '0'}
            </span>
          </div>

          <Card className='p-4 border border-neutral-500'>
            {/* NFT Price */}
            <div className='text-sm'>
              NFT Price:{' '}
              <span className='font-semibold'>
                ${startup.nftPrice || '0'} ckUSDC
              </span>
            </div>

            {/* Authentication Notice for Unauthenticated Users */}
            {!isAuthenticated && (
              <div className='mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700'>
                💡 Sign in and register as an investor to make investments
              </div>
            )}

            {/* Button */}
            <Button 
              variant='primary' 
              className='w-full mt-3'
              onClick={handleInvestClick}
              disabled={investmentLoading}
            >
              <Banknote size={20} /> 
              {investmentLoading ? 'Checking...' : 'Invest Now'}
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
