'use client';

import {
  AlertTriangle,
  Banknote,
  BanknoteArrowUp,
  BarChart3,
  ChartCandlestick,
  FileText,
  FolderOpen,
  GalleryHorizontalEnd,
  Sparkle,
  ThumbsUp,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Tabs from '@/components/layout/Tabs';
import {
  Badge,
  Button,
  Card,
  ImageGallery,
  InvestmentModal,
  NFTAnalysisCard,
  ProgressBar,
  Skeleton,
  SkeletonText,
  CardSkeleton,
  ChatInterface,
} from '@/components/ui';
import { StartupService } from '@/services/marketplace';
import { getRiskLevel } from '@/utils/riskLevels';

import Documents from './partial/Documents';
import Financials from './partial/Financials';
import FounderTeam from './partial/FounderTeam';
import Overview from './partial/Overview';
import Risks from './partial/Risks';

interface Startup {
  id: string;
  startupName: string;
  description: string;
  sector: string;
  status: string;
  location: string;
  teamMembers: { name: string; role: string }[];
  companyImages: string[];
  companyLogo: string[];
  periodicProfitSharing: string;
  monthlyRevenue: string;
  nftPrice: string;
  fundingGoal: string;
}

interface InvestmentDetails {
  id: string;
  name: string;
  nftPrice: number;
  monthlyReturns: number;
  expectedROI: number;
  availableNFTs: number;
  totalNFTs: number;
  soldNFTs: number;
}

export default function ExploreDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '1'; // Get ID from query parameter
  console.log('Detail page loaded with ID:', id);
  const authLoading = false;
  const investmentLoading = false;

  const [activeTab, setActiveTab] = useState(0);
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const investmentLoadingData = false;
  const [investmentData, setInvestmentData] =
    useState<InvestmentDetails | null>(null);

  // Chat interface state
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    setStartup(null);
    setError(null);
    setLoading(true);
  }, [id]);

  // Fetch startup details from backend
  const fetchStartupDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching startup details for ID:', id);
      // Use StartupService to fetch details
      const startupData = await StartupService.getStartupDetails(id);
      console.log('Startup data received:', startupData);

      if (startupData) {
        // Transform backend data to match UI requirements
        const transformedStartup: Startup = {
          id: startupData.id,
          startupName: startupData.startupName,
          description: startupData.description,
          sector: startupData.sector,
          status: startupData.status,
          location: startupData.location,
          teamMembers:
            startupData.teamMembers?.map(member => ({
              name: member.name,
              role: member.role,
            })) || [],
          companyImages: startupData.companyImages || [],
          companyLogo:
            startupData.companyLogo && startupData.companyLogo.length > 0
              ? [startupData.companyLogo[0] as string]
              : ['/assets/images/icon-startup.png'],
          periodicProfitSharing: startupData.periodicProfitSharing,
          monthlyRevenue: startupData.monthlyRevenue,
          nftPrice: startupData.nftPrice,
          fundingGoal: startupData.fundingGoal,
        };
        setStartup(transformedStartup);
      } else {
        setError('Startup not found');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to load startup details: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (authLoading) return;
    fetchStartupDetails();
  }, [fetchStartupDetails, authLoading]);

  const tabs = [
    { label: 'Overview', icon: <FileText size={16} /> },
    { label: 'Financials', icon: <BarChart3 size={16} /> },
    { label: 'Founder & Team', icon: <Users size={16} /> },
    { label: 'Documents', icon: <FolderOpen size={16} /> },
    { label: 'Risks', icon: <AlertTriangle size={16} /> },
  ];

  const images = startup?.companyImages?.length
    ? startup.companyImages
    : ['/assets/images/product.png'];

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

  const handleInvestNow = async () => {
    try {
      // Get NFT price from backend
      const priceResult = await StartupService.getNFTPrice(id);
      const nftPrice = priceResult.success
        ? Number(priceResult.price)
        : Number(startup?.nftPrice) || 75;

      // Get NFTs for this startup to calculate availability
      const nftsResult = await StartupService.getNFTsByStartup(id);
      const availableNFTs = nftsResult.success
        ? nftsResult.nfts?.length || 10
        : 10;

      // Calculate monthly returns (this could be fetched from backend in a real implementation)
      const periodicProfitSharing =
        Number(startup?.periodicProfitSharing?.replace(/[^0-9.]/g, '')) || 5;
      const monthlyReturns = Math.round(
        nftPrice * (periodicProfitSharing / 100)
      );
      const expectedROI = Math.round(((monthlyReturns * 12) / nftPrice) * 100);

      const details: InvestmentDetails = {
        id,
        name: startup?.startupName || 'Unknown Startup',
        nftPrice,
        monthlyReturns,
        expectedROI,
        availableNFTs,
        totalNFTs: availableNFTs + 5, // This would come from backend in real implementation
        soldNFTs: 5, // This would come from backend in real implementation
      };
      setInvestmentData(details);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error preparing investment data:', error);
      console.error('Failed to prepare investment data. Please try again.');
    }
  };

  // Handle AI analysis
  const handleAnalyzeStartup = async (startupId: string) => {
    if (!startup) return;
    setIsChatOpen(true);
  };

  if (loading) {
    return (
      <div className='bg-gray-50 text-gray-900 min-h-screen'>
        <Navbar />
        <div className='max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Skeleton Left (image gallery) */}
          <Skeleton height={400} className='w-full rounded-lg' />

          {/* Skeleton Right (card) */}
          <CardSkeleton textRows={4} />
        </div>

        <div className='max-w-6xl mx-auto mt-8'>
          <Tabs tabs={tabs} onChange={setActiveTab} />
          <div className='p-6'>
            <SkeletonText lines={6} />
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
        <div className='flex justify-center items-center min-h-[60vh]'>
          <p>{error || 'Startup not found.'}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='bg-gray-50 text-gray-900 min-h-screen'>
      <Navbar />

      <div className='max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Left Side */}
        <ImageGallery
          images={images.filter(img => img && !img.includes('undefined'))}
          showViewMore={true}
          onViewMore={() => console.log('View more clicked')}
        />

        {/* Right Side */}
        <Card className='bg-neutral-100 flex flex-col gap-4'>
          <div className='flex gap-2'>
            <Badge variant='primary' icon={<ThumbsUp size={16} />}>
              Featured
            </Badge>
            <Badge variant='success'>{startup.sector}</Badge>
            <Badge variant='warning'>{getRiskLevel(startup.sector)}</Badge>
          </div>

          <div className='flex gap-3'>
            <Image
              src={
                startup.companyLogo?.[0] &&
                !startup.companyLogo[0].includes('undefined')
                  ? startup.companyLogo[0]
                  : '/assets/images/icon-startup.png'
              }
              className='w-8 h-8 rounded'
              alt='Logo'
              width={32}
              height={32}
              unoptimized={startup.companyLogo?.[0]?.startsWith(
                'https://gecvpysiaymyyynjhpfz.supabase.co'
              )}
            />
            <h2 className='text-2xl font-semibold'>{startup.startupName}</h2>
          </div>
          <p className='text-gray-600 text-sm'>{startup.description}</p>
          <p className='text-sm text-gray-500'>📍 {startup.location}</p>

          <div className='space-y-2 text-sm'>
            <p className='flex gap-2 items-center'>
              <ChartCandlestick size={20} /> Periodic Returns:{' '}
              <span className='font-semibold'>
                {startup.periodicProfitSharing}
              </span>
            </p>
            <p className='flex gap-2 items-center'>
              <BanknoteArrowUp size={20} /> Monthly Revenue:{' '}
              <span className='font-semibold'>${startup.monthlyRevenue}</span>
            </p>
            <p className='flex gap-2 items-center'>
              <GalleryHorizontalEnd size={20} /> NFT Price:{' '}
              <span className='font-semibold'>${startup.nftPrice}</span>
            </p>
            <p className='flex gap-2 items-center'>
              <Sparkle size={20} /> Funding Goal:{' '}
              <span className='text-orange-500 font-semibold'>
                ${startup.fundingGoal}
              </span>
            </p>
            <ProgressBar value={45} max={100} color='bg-orange-500' />
          </div>

          <Button
            onClick={handleInvestNow}
            disabled={investmentLoadingData || startup.status !== 'active'}
          >
            <Banknote size={20} />
            {investmentLoading
              ? 'Loading...'
              : startup.status === 'active'
                ? 'Invest Now'
                : 'Not Available'}
          </Button>
        </Card>
      </div>

      <div className='max-w-6xl mx-auto'>
        {/* Tabs and Analysis Card Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left side - Tabs and Content */}
          <div className='lg:col-span-2'>
            <Tabs tabs={tabs} onChange={setActiveTab} />
            <div>{renderContent()}</div>
          </div>

          {/* Right side - Chat Interface */}
          <div className='lg:col-span-1 flex justify-center lg:justify-start'>
            <div className='sticky top-8 w-full max-w-sm h-[600px]'>
              {!isChatOpen ? (
                <NFTAnalysisCard
                  startupId={id}
                  startupName={startup.startupName}
                  onAnalyze={handleAnalyzeStartup}
                  className='w-full'
                />
              ) : (
                <ChatInterface
                  isOpen={isChatOpen}
                  onClose={() => setIsChatOpen(false)}
                  startupData={startup}
                  startupName={startup.startupName}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <InvestmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        startup={investmentData as InvestmentDetails}
        onInvest={async investmentDetails => {
          try {
            // In a real implementation, you would call the backend to process the investment
            // For example:
            // const result = await InvestorService.purchaseNFT({
            //   startupId: id,
            //   investorId: currentUser.id,
            //   amount: investmentDetails.quantity * investmentDetails.nftPrice,
            //   memo: `Purchase of ${investmentDetails.quantity} NFTs for ${startup?.startupName}`
            // });

            console.log('Investment details:', investmentDetails);
            console.log(`Successfully invested in ${startup?.startupName}!`);
            setIsModalOpen(false);
          } catch (error) {
            console.error('Error processing investment:', error);
            console.error('Failed to process investment. Please try again.');
          }
        }}
        isLoading={investmentLoading}
      />

      <Footer />
    </div>
  );
}
