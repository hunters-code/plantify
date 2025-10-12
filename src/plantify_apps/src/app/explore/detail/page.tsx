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
import { useState, useEffect, useCallback, Suspense } from 'react';

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
import { InvestorService } from '@/services/investors/InvestorService';
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

function ExploreDetailContent() {
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
    // Use existing startup data for immediate modal opening
    const fallbackNftPrice = Number(startup?.nftPrice) || 75;
    const fallbackAvailableNFTs = 10; // Default value

    // Calculate monthly returns using existing data
    const periodicProfitSharing =
      Number(startup?.periodicProfitSharing?.replace(/[^0-9.]/g, '')) || 5;
    const monthlyReturns = Math.round(
      fallbackNftPrice * (periodicProfitSharing / 100)
    );
    const expectedROI = Math.round(
      ((monthlyReturns * 12) / fallbackNftPrice) * 100
    );

    // Create initial details with fallback data for immediate modal opening
    const initialDetails: InvestmentDetails = {
      id,
      name: startup?.startupName || 'Unknown Startup',
      nftPrice: fallbackNftPrice,
      monthlyReturns,
      expectedROI,
      availableNFTs: fallbackAvailableNFTs,
      totalNFTs: fallbackAvailableNFTs + 5,
      soldNFTs: 5,
    };

    // Open modal immediately with fallback data
    setInvestmentData(initialDetails);
    setIsModalOpen(true);
    console.log(
      'Opening investment modal immediately with data:',
      initialDetails
    );

    // Then fetch real data in the background and update if needed
    try {
      const [priceResult, nftsResult] = await Promise.all([
        StartupService.getNFTPrice(id),
        StartupService.getNFTsByStartup(id),
      ]);

      const actualNftPrice = priceResult.success
        ? Number(priceResult.price)
        : fallbackNftPrice;

      const actualAvailableNFTs = nftsResult.success
        ? nftsResult.nfts?.length || fallbackAvailableNFTs
        : fallbackAvailableNFTs;

      // Only update if the data is different from fallback
      if (
        actualNftPrice !== fallbackNftPrice ||
        actualAvailableNFTs !== fallbackAvailableNFTs
      ) {
        const actualMonthlyReturns = Math.round(
          actualNftPrice * (periodicProfitSharing / 100)
        );
        const actualExpectedROI = Math.round(
          ((actualMonthlyReturns * 12) / actualNftPrice) * 100
        );

        const updatedDetails: InvestmentDetails = {
          id,
          name: startup?.startupName || 'Unknown Startup',
          nftPrice: actualNftPrice,
          monthlyReturns: actualMonthlyReturns,
          expectedROI: actualExpectedROI,
          availableNFTs: actualAvailableNFTs,
          totalNFTs: actualAvailableNFTs + 5,
          soldNFTs: 5,
        };

        setInvestmentData(updatedDetails);
        console.log('Updated investment modal with real data:', updatedDetails);
      }
    } catch (error) {
      console.error('Error fetching updated investment data:', error);
      // Modal is already open with fallback data, so no need to show error
    }
  };

  // Handle AI analysis
  const handleAnalyzeStartup = async (_startupId: string) => {
    if (!startup) return;
    setIsChatOpen(true);
  };

  // Handle investment from chat
  const handleInvestFromChat = () => {
    handleInvestNow();
  };

  // Handle actual investment purchase
  const handleInvestmentPurchase = async (investmentDetails: {
    startupId: string | number;
    quantity: number;
    totalAmount: number;
  }) => {
    try {
      console.log('Processing investment:', investmentDetails);
      // Get current investor information
      const investor = await InvestorService.getInvestorByPrincipal();
      if (!investor) {
        throw new Error(
          'Investor not found. Please register as an investor first.'
        );
      }
      // Create NFT purchase request
      const purchaseRequest = {
        startupId: investmentDetails.startupId.toString(),
        investorId: investor.id,
        amount: BigInt(investmentDetails.totalAmount),
        memo: [
          `Purchase of ${investmentDetails.quantity} NFTs for ${startup?.startupName}`,
        ] as [] | [string],
      };

      // Call backend service
      const result = await InvestorService.purchaseNFT(purchaseRequest);
      if (result.success) {
        console.log('Investment successful!', result.response);
        setIsModalOpen(false);
        // Show success message
        // Show success message
        console.log(
          `🎉 Investment successful! You have purchased ${investmentDetails.quantity} NFTs for ${startup?.startupName}.`
        );
      } else {
        console.error('Investment failed:', result.error);
        throw new Error(result.error || 'Investment failed');
      }
    } catch (error) {
      console.error('Error processing investment:', error);
      throw error; // Re-throw to let the modal handle the error state
    }
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

          <Button onClick={handleInvestNow}>
            <Banknote size={20} />
            {investmentLoading ? 'Loading...' : 'Invest Now'}
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
                  startupData={startup as any}
                  startupName={startup.startupName}
                  onInvestClick={handleInvestFromChat}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <InvestmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        startup={
          investmentData
            ? {
                id: investmentData.id,
                name: investmentData.name,
                availableNFTs: investmentData.availableNFTs,
                nftPrice: investmentData.nftPrice,
                monthlyReturns: investmentData.monthlyReturns,
                expectedROI: investmentData.expectedROI,
              }
            : undefined
        }
        onInvest={handleInvestmentPurchase}
        isLoading={investmentLoading}
      />

      <Footer />
    </div>
  );
}

export default function ExploreDetail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExploreDetailContent />
    </Suspense>
  );
}
