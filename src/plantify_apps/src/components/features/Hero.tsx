'use client';

import {
  CircleDollarSign,
  DraftingCompass,
  Globe,
  ShieldUser,
  UsersRound,
} from 'lucide-react';

import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();

  return (
    <section className='relative isolate bg-white'>
      <div className='pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-white to-violet-50' />
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-14'>
        {/* Headline */}
        <div className='text-center max-w-3xl mx-auto'>
          <h1 className='text-4xl sm:text-5xl font-normal flex flex-col gap-3 font-ibm'>
            <span className='block'>Invest in Startups</span>
            <span className='block'>Earn Stable Returns</span>
          </h1>
          <p className='mt-4 text-sm text-gray-600 font-geist'>
            A startup investment platform based on NFTs with profit sharing.
            Transparent, decentralized, and community-driven.
          </p>

          {/* CTAs */}
          <div className='mt-6 flex flex-col sm:flex-row gap-3 justify-center'>
            <Button
              as='a'
              onClick={() => router.push('/register/founder')}
              variant='primary'
            >
              <ShieldUser size={20} />
              Register as Founder
            </Button>

            <Button as='a' href='#browse' variant='secondary'>
              <Globe size={20} />
              Browse Startups
            </Button>
          </div>
        </div>

        {/* Hero image */}
        <div className='mt-10'>
          <img
            src='/assets/images/hero.webp'
            alt='Coworking founders and investors'
            className='w-full rounded-3xl shadow-xl ring-1 object-cover'
          />
        </div>

        {/* Stats bar */}
        <div className='mt-6 flex gap-3 justify-center'>
          <div className='flex items-center gap-3 rounded-xl px-4 py-3'>
            <span className='inline-flex h-8 w-8 items-center justify-center rounded-full shadow-md'>
              <DraftingCompass size={18} className='text-amber-500' />
            </span>
            <div>
              <div className='text-sm font-semibold'>247 Active Startups</div>
            </div>
          </div>
          <div className='flex items-center gap-3 rounded-xl px-4 py-3'>
            <span className='inline-flex h-8 w-8 items-center justify-center rounded-full shadow-md'>
              <CircleDollarSign size={18} className='text-amber-500' />
            </span>
            <div>
              <div className='text-sm font-semibold'>
                $2.3M ckUSDC Distributed
              </div>
            </div>
          </div>
          <div className='flex items-center gap-3 rounded-xl px-4 py-3'>
            <span className='inline-flex h-8 w-8 items-center justify-center rounded-full shadow-md'>
              <UsersRound size={18} className='text-amber-500' />
            </span>
            <div>
              <div className='text-sm font-semibold'>
                15,432 Total Investors
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
