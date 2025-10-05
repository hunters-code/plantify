'use client';

import { useState, useEffect, useRef } from 'react';
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
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Tabs from '@/components/layout/Tabs';
import {
  Badge,
  Button,
  Card,
  ImageGallery,
  InvestmentModal,
  ProgressBar,
  Skeleton,
  SkeletonText,
  CardSkeleton,
} from '@/components/ui';

import Overview from './partial/Overview';
import Financials from './partial/Financials';
import FounderTeam from './partial/FounderTeam';
import Documents from './partial/Documents';
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

export default function ExploreDetail() {
  const id = "1"; // dummy ID
  const isAuthenticated = true;
  const authLoading = false;
  const investmentLoading = false;

  const [activeTab, setActiveTab] = useState(0);
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const investmentLoadingData = false;
  const [investmentData, setInvestmentData] = useState<any>(null);

  useEffect(() => {
    setStartup(null);
    setError(null);
    setLoading(true);
  }, [id]);

  useEffect(() => {
    if (authLoading) return;

    const fetchStartupDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // dummy data
        const mockStartup: Startup = {
          id: id,
          startupName: 'EcoFarm Solutions',
          description:
            'Revolutionary hydroponic farming system using IoT technology...',
          sector: 'Agriculture',
          status: 'approved',
          location: 'Bandung, Indonesia',
          teamMembers: [
            { name: 'Anya Rodriguez', role: 'CEO & Founder' },
            { name: 'Marcus Johnson', role: 'CTO' },
            { name: 'Lisa Chen', role: 'Head of Product' },
          ],
          companyImages: [
            '/assets/images/product.png',
            '/assets/images/product.png',
            '/assets/images/product.png',
            '/assets/images/product.png',
          ],
          companyLogo: ['/assets/images/icon-startup.png'],
          periodicProfitSharing: '15% annually',
          monthlyRevenue: '25,000',
          nftPrice: '500',
          fundingGoal: '100,000',
        };
        setTimeout(() => setStartup(mockStartup), 1200); // delay 1.2s
      } catch (err: any) {
        setError(`Failed to load startup details: ${err.message}`);
      } finally {
        setTimeout(() => setLoading(false), 1200);
      }
    };

    fetchStartupDetails();
  }, [id, authLoading]);

  const tabs = [
    { label: 'Overview', icon: <FileText size={16} /> },
    { label: 'Financials', icon: <BarChart3 size={16} /> },
    { label: 'Founder & Team', icon: <Users size={16} /> },
    { label: 'Documents', icon: <FolderOpen size={16} /> },
    { label: 'Risks', icon: <AlertTriangle size={16} /> },
  ];

  const images =
    startup?.companyImages?.length
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
    const details = {
      id,
      name: startup?.startupName || 'Unknown Startup',
      nftPrice: startup?.nftPrice || 75,
      monthlyReturns: 50,
      expectedROI: 192,
      availableNFTs: 10,
      totalNFTs: 10,
      soldNFTs: 0,
    };
    setInvestmentData(details);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 text-gray-900 min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skeleton Left (image gallery) */}
          <Skeleton height={400} className="w-full rounded-lg" />

          {/* Skeleton Right (card) */}
          <CardSkeleton textRows={4} />
        </div>

        <div className="max-w-6xl mx-auto mt-8">
          <Tabs
            tabs={tabs}
            onChange={setActiveTab}
          />
          <div className="p-6">
            <SkeletonText lines={6} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="bg-gray-50 text-gray-900 min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p>{error || 'Startup not found.'}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side */}
        <ImageGallery
          images={images}
          showViewMore={true}
          onViewMore={() => console.log('View more clicked')}
        />

        {/* Right Side */}
        <Card className="bg-neutral-100 flex flex-col gap-4">
          <div className="flex gap-2">
            <Badge variant="primary" icon={<ThumbsUp size={16} />}>
              Featured
            </Badge>
            <Badge variant="success">Agriculture</Badge>
            <Badge variant="warning">Moderate Risk</Badge>
          </div>

          <div className="flex gap-3">
            <img
              src={startup.companyLogo?.[0] || '/assets/images/icon-startup.png'}
              className="w-8 h-8 rounded"
              alt="Logo"
            />
            <h2 className="text-2xl font-semibold">{startup.startupName}</h2>
          </div>
          <p className="text-gray-600 text-sm">{startup.description}</p>
          <p className="text-sm text-gray-500">📍 {startup.location}</p>

          <div className="space-y-2 text-sm">
            <p className="flex gap-2 items-center">
              <ChartCandlestick size={20} /> Periodic Returns:{" "}
              <span className="font-semibold">{startup.periodicProfitSharing}</span>
            </p>
            <p className="flex gap-2 items-center">
              <BanknoteArrowUp size={20} /> Monthly Revenue:{" "}
              <span className="font-semibold">${startup.monthlyRevenue}</span>
            </p>
            <p className="flex gap-2 items-center">
              <GalleryHorizontalEnd size={20} /> NFT Price:{" "}
              <span className="font-semibold">${startup.nftPrice}</span>
            </p>
            <p className="flex gap-2 items-center">
              <Sparkle size={20} /> Funding Goal:{" "}
              <span className="text-orange-500 font-semibold">
                ${startup.fundingGoal}
              </span>
            </p>
            <ProgressBar value={45} max={100} color="bg-orange-500" />
          </div>

          <Button onClick={handleInvestNow} disabled={investmentLoadingData}>
            <Banknote size={20} />
            {investmentLoading ? "Loading..." : "Invest Now"}
          </Button>
        </Card>
      </div>

      <div className="max-w-6xl mx-auto">
        <Tabs tabs={tabs} onChange={setActiveTab} />
        <div>{renderContent()}</div>
      </div>

      <InvestmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        startup={investmentData}
        onInvest={() => { }}
        isLoading={investmentLoading}
      />

      <Footer />
    </div>
  );
}
