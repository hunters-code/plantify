'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useFeaturedStartupsPaginated } from '@/hooks/useFeaturedStartupsPaginated';
import {
  StartupCard,
  StartupCardProps,
} from '@/components/startup/StartupCard';
import { Button } from '@/components/ui';
import { GlobeIcon } from '../icons';

export default function FeaturedStartups() {
  const router = useRouter();
  const { startups, loading, error } = useFeaturedStartupsPaginated();

  // Transform backend startup data to match UI requirements
  const featuredStartups: StartupCardProps[] = startups.map(startup => {
    const totalFunded = Number(startup.totalFunded || 0);
    const fundingGoal = Number(startup.fundingGoal || 1); // Avoid division by zero
    const fundedPercentage = Math.min(totalFunded / fundingGoal, 1);
    const fundedAmount = totalFunded;
    const fundedText = `${Math.round(fundedPercentage * 100)}% Funded`;

    return {
      id: startup.id,
      image: startup.companyImages?.[0] || '/assets/images/icon-startup.png',
      title: startup.startupName,
      description: startup.description,
      category: startup.sector,
      riskLevel: 'Moderate Risk', // Default risk level
      location: startup.location || 'Global',
      employees: '12 employees', // Default employee count
      logo: startup.companyLogo?.[0],
      nftPrice: `$${startup.nftPrice} ckUSDC`,
      periodicReturn: `$${startup.periodicProfitSharing}`,
      annualROI: `${startup.periodicProfitSharing}`,
      availability: '167 NFT', // Default availability
      fundedText,
      fundedPct: fundedPercentage,
      fundedColor: fundedPercentage >= 1 ? '#22c55e' : '#3b82f6',
      totalFunded,
      fundingGoal,
      builtByCaffeineAI: Array.isArray(startup.builtByCaffeineAI)
        ? startup.builtByCaffeineAI.length > 0
        : Boolean(startup.builtByCaffeineAI),
    };
  });

  const handleExploreAll = () => {
    router.push('/explore');
  };

  return (
    <section className='relative isolate py-16 sm:py-20 bg-[#1f1f1f]'>
      {/* subtle top+bottom fades so it looks cushioned on dark bg */}
      <div className='pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white/0 via-white/0 to-white/0' />

      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <h2 className='text-center font-geist text-2xl sm:text-3xl font-semibold text-white mb-16'>
          Featured Startups
        </h2>

        {loading && (
          <div className='flex justify-center items-center py-12'>
            <Loader2 size={32} className='animate-spin text-white' />
            <span className='ml-3 text-white'>
              Loading featured startups...
            </span>
          </div>
        )}

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 mb-6'>
            <div className='flex items-center'>
              <div className='text-red-600 mr-3'>⚠️</div>
              <div>
                <h3 className='text-red-800 font-medium'>
                  Error Loading Featured Startups
                </h3>
                <p className='text-red-600 text-sm mt-1'>{error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
              {featuredStartups.map((startup: StartupCardProps) => (
                <StartupCard key={startup.id} {...startup} />
              ))}
            </div>

            {featuredStartups.length === 0 && (
              <div className='text-center py-12'>
                <div className='text-gray-400 mb-4'>
                  <GlobeIcon className='mx-auto' />
                </div>
                <h3 className='text-lg font-medium text-white mb-2'>
                  No featured startups available
                </h3>
                <p className='text-gray-300'>
                  Check back later for new investment opportunities.
                </p>
              </div>
            )}
          </>
        )}

        <div className='mt-16 flex justify-center'>
          <Button
            onClick={handleExploreAll}
            leftIcon={<GlobeIcon />}
            variant='secondary'
          >
            Explore All Startups
          </Button>
        </div>
      </div>
    </section>
  );
}
