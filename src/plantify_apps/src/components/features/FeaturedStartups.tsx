'use client';

import { CircleDollarSign, Coins, Eye, Globe, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
// import { useFeaturedStartups } from '../../hooks/useFeaturedStartups';

interface StartupCardProps {
    id: string | number;
    image: string;
    title: string;
    category?: string;
    nftPrice: string;
    periodicReturn: string;
    fundedText: string;
    fundedPct?: number;
    fundedColor?: string;
}

export function StartupCard({
  id,
  image,
  title,
  category,
  nftPrice,
  periodicReturn,
  fundedText,
  fundedPct = 0.45,
  fundedColor = '#22c55e',
}: StartupCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/explore/detail/${id}`);
  };

  return (
    <div className='group rounded-2xl bg-white ring-1 ring-black/5 shadow-sm hover:shadow-lg transition-shadow overflow-hidden'>
      {/* Image with padding */}
      <div className='p-3'>
        <div className='relative overflow-hidden rounded-xl h-[250px]'>
          <Image
            src={image}
            alt={title}
            fill
            className='object-cover'
          />
          {category && (
            <span className='absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium ring-1 ring-black/10 shadow-sm'>
              {category}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className='px-4 pb-4'>
        <h3 className='font-ibm text-[15px] sm:text-[16px] font-semibold text-gray-900 leading-tight'>
          {title}
        </h3>

        <ul className='mt-3 space-y-1.5 text-[13px] text-gray-700'>
          <li className='flex items-center gap-2'>
            <Coins size={14} className='text-gray-500' />
            <span className='text-gray-800'>
                            NFT Price: <span className='font-semibold'>{nftPrice}</span>
            </span>
          </li>
          <li className='flex items-center gap-2'>
            <CircleDollarSign size={14} className='text-gray-500' />
            <span className='text-gray-800'>
                            Periodic Returns:{' '}
              <span className='font-semibold'>{periodicReturn}</span>
            </span>
          </li>
          <li className='flex items-center gap-2'>
            <span className='inline-block h-2 w-2 rounded-full bg-amber-500' />
            <span className='text-gray-800'>
                            Funding Progress:{' '}
              <span className='font-semibold text-amber-600'>{fundedText}</span>
            </span>
          </li>
        </ul>

        {/* Progress */}
        <div className='mt-2 h-1.5 w-full rounded-full bg-gray-200'>
          <div
            className='h-1.5 rounded-full'
            style={{
              width: `${Math.min(100, Math.max(0, fundedPct * 100))}%`,
              backgroundColor: fundedColor,
            }}
          />
        </div>

        {/* CTA */}
        <div className='mt-4'>
          <button
            onClick={handleViewDetails}
            className='w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 text-[13px] font-medium text-gray-900 px-3 py-2 shadow hover:bg-white transition'
          >
            <Eye size={20} /> View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedStartups() {
  const router = useRouter();
  // const { featuredStartups, loading, error } = useFeaturedStartups();

  // Dummy data
  const loading = false;
  const error = null;
  const featuredStartups: StartupCardProps[] = [
    {
      id: '1',
      image: '/assets/images/startup-1.jpg',
      title: 'Organic Farm Co.',
      category: 'Agriculture',
      nftPrice: '$100',
      periodicReturn: '15-25% Annual',
      fundedText: '65% Funded',
      fundedPct: 0.65,
      fundedColor: '#22c55e',
    },
    {
      id: '2',
      image: '/assets/images/startup-2.jpg',
      title: 'FreshMeat Poultry',
      category: 'Livestock',
      nftPrice: '$150',
      periodicReturn: '20-30% Annual',
      fundedText: '80% Funded',
      fundedPct: 0.8,
      fundedColor: '#22c55e',
    },
    {
      id: '3',
      image: '/assets/images/startup-3.jpg',
      title: 'TechFlow SaaS',
      category: 'Technology',
      nftPrice: '$200',
      periodicReturn: '40-60% Annual',
      fundedText: '45% Funded',
      fundedPct: 0.45,
      fundedColor: '#f59e0b',
    },
  ];

  const handleExploreAll = () => {
    router.push('/explore');
  };

  return (
    <section className='relative isolate py-16 sm:py-20 bg-[#1f1f1f]'>
      {/* subtle top+bottom fades so it looks cushioned on dark bg */}
      <div className='pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white/0 via-white/0 to-white/0' />

      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <h2 className='text-center font-ibm text-2xl sm:text-3xl font-semibold text-white mb-6'>
                    Featured Startups
        </h2>

        {loading && (
          <div className='flex justify-center items-center py-12'>
            <Loader2 size={32} className='animate-spin text-white' />
            <span className='ml-3 text-white'>Loading featured startups...</span>
          </div>
        )}

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 mb-6'>
            <div className='flex items-center'>
              <div className='text-red-600 mr-3'>⚠️</div>
              <div>
                <h3 className='text-red-800 font-medium'>Error Loading Startups</h3>
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
                  <Globe size={48} className='mx-auto' />
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

        <div className='mt-6 flex justify-center'>
          <button
            onClick={handleExploreAll}
            className='inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow hover:bg-gray-50'
          >
            <Globe size={20} />
                        Explore All Startups
          </button>
        </div>
      </div>
    </section>
  );
}
