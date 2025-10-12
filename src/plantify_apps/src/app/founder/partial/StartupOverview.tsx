'use client';

import { Eye, MapPin, Sparkles, ThumbsUp, WalletCards } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Badge, Button, Card, ProgressBar } from '@/components/ui';
import type {
  Startup,
  NFTPurchaseHistory,
} from '@/declarations/plantify_backend/plantify_backend.did';
import { StartupService } from '@/services/marketplace/StartupService';
import { formatCurrency } from '@/utils/formatCurrency';

const formatNumber = (value: number, decimals: number = 0) =>
  value.toFixed(decimals);

interface StartupOverviewProps {
  startupId: string;
}

export default function StartupOverview({ startupId }: StartupOverviewProps) {
  const [startup, setStartup] = useState<Startup | null>(null);
  const [purchaseHistory, setPurchaseHistory] =
    useState<NFTPurchaseHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStartupData = async () => {
      if (!startupId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch startup details and purchase history in parallel
        const [startupResult, purchaseResult] = await Promise.all([
          StartupService.getStartupDetails(startupId),
          StartupService.getStartupPurchaseHistory(startupId),
        ]);

        if (startupResult) {
          setStartup(startupResult);
        }

        if (purchaseResult.success && purchaseResult.history) {
          setPurchaseHistory(purchaseResult.history);
        }
      } catch (err) {
        console.error('Error fetching startup overview data:', err);
        setError('Failed to load startup data');
      } finally {
        setLoading(false);
      }
    };

    fetchStartupData();
  }, [startupId]);

  if (loading) {
    return (
      <div className='bg-neutral-100 rounded-[16px] p-6'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-300 rounded w-1/3'></div>
          <div className='h-4 bg-gray-200 rounded w-2/3'></div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {[1, 2, 3].map(i => (
              <div key={i} className='bg-white rounded-lg p-4'>
                <div className='h-6 bg-gray-300 rounded mb-2'></div>
                <div className='h-4 bg-gray-200 rounded'></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-[16px] p-6'>
        <div className='text-red-600'>
          <h2 className='text-xl font-semibold mb-2'>Error Loading Overview</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className='bg-neutral-100 rounded-[16px] p-6'>
        <div className='text-center py-8'>
          <h2 className='text-xl font-semibold mb-2'>No Startup Data</h2>
          <p className='text-gray-500'>Unable to load startup information.</p>
        </div>
      </div>
    );
  }

  // Calculate metrics from real data
  const fundingGoal = Number(startup.fundingGoal.replace(/[^0-9.]/g, '')) || 0;
  const totalRaised = purchaseHistory ? Number(purchaseHistory.totalSpent) : 0;
  const fundingProgress =
    fundingGoal > 0 ? (totalRaised / fundingGoal) * 100 : 0;
  const nftSales = purchaseHistory ? Number(purchaseHistory.totalNFTs) : 0;
  const totalNFTs = nftSales + 50; // Estimate total available NFTs

  const teamSize = startup.teamMembers ? startup.teamMembers.length : 0;
  const fundingRaised = (fundingProgress / 100) * fundingGoal;
  const nftSalesPercentage = totalNFTs > 0 ? (nftSales / totalNFTs) * 100 : 0;

  return (
    <Card className='bg-neutral-100'>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex flex-col gap-2'>
          <div className='flex gap-3 items-center'>
            <h2 className='text-xl font-semibold'>
              {startup.startupName || 'Unnamed Startup'}
            </h2>
            <p className='text-sm text-gray-500 border border-neutral-200 px-2 py-1 rounded-lg flex gap-2'>
              <MapPin size={16} />
              {startup.location || 'Location not specified'} · {teamSize}{' '}
              employees
            </p>
          </div>
          <div className='flex gap-2'>
            <Badge variant='primary' icon={<ThumbsUp size={16} />}>
              {startup.status === 'approved' ? 'Active' : startup.status}
            </Badge>
            <Badge variant='success'>
              {startup.sector || 'Unknown Sector'}
            </Badge>
            <Badge variant='warning'>{startup.companyType || 'Startup'}</Badge>
          </div>
        </div>
        <Button variant='secondary'>
          <Eye size={16} />
          View Public Page
        </Button>
      </div>

      <Card className='mb-6'>
        <div className='flex flex-col gap-2 text-[16px]'>
          <span className='text-black font-ibm'>Description</span>
          <span className='text-neutral-500'>
            {startup.description ||
              'No description available for this startup.'}
          </span>
        </div>
      </Card>

      <div className='grid grid-cols-2 gap-6'>
        <Card className='flex gap-2'>
          <Sparkles size={16} className='text-gray-400 mt-1' />
          <div className='w-full'>
            <p className='text-sm text-gray-500 mb-1'>
              Funding Progress: {formatNumber(fundingProgress, 1)}% Funded
            </p>
            <ProgressBar
              value={fundingProgress}
              max={100}
              color='bg-purple-600'
              showValue={false}
            />
            <p className='text-sm text-gray-600 mt-1'>
              {formatCurrency(fundingRaised)} / {formatCurrency(fundingGoal)}
            </p>
          </div>
        </Card>

        <Card className='flex gap-2'>
          <WalletCards size={16} className='text-gray-400 mt-1' />
          <div className='w-full'>
            <p className='text-sm text-gray-500 mb-1'>
              NFT Sales: {formatNumber(nftSalesPercentage, 1)}%
            </p>
            <ProgressBar
              value={nftSalesPercentage}
              max={100}
              color='bg-orange-500'
              showValue={false}
            />
            <p className='text-sm text-gray-600 mt-1'>
              {nftSales} / {totalNFTs}
            </p>
          </div>
        </Card>
      </div>
    </Card>
  );
}
