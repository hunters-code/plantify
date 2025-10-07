'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ShieldUser } from 'lucide-react';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';

interface Step {
  title: string;
  desc: string;
}

interface StepsData {
  founders: Step[];
  investors: Step[];
}

type TabType = 'founders' | 'investors';

const stepsData: StepsData = {
  founders: [
    {
      title: 'Submit your application.',
      desc: 'Upload your business plan and necessary documents.',
    },
    {
      title: 'Secure collateral.',
      desc: 'Offer 12 months of profit sharing as a guarantee.',
    },
    {
      title: 'Launch your NFT.',
      desc: 'Gather funds from community investors.',
    },
    {
      title: 'Provide monthly reports.',
      desc: 'Share progress reports and distribute profit shares.',
    },
  ],
  investors: [
    {
      title: 'Verify your identity.',
      desc: 'Complete KYC to unlock investment features.',
    },
    {
      title: 'Browse opportunities.',
      desc: 'Filter startups by sector, stage, and risk profile.',
    },
    {
      title: 'Invest with NFTs.',
      desc: 'Purchase fractional NFTs that represent your stake.',
    },
    {
      title: 'Track performance.',
      desc: 'Receive updates and profit sharing to your wallet.',
    },
  ],
};

const pillBase =
  'flex items-center justify-center gap-1.5 px-3 py-2 rounded-[12px] text-sm font-medium transition-colors';

export default function HowItWork() {
  const [tab, setTab] = useState<TabType>('founders');

  const steps = useMemo(
    () => (tab === 'founders' ? stepsData.founders : stepsData.investors),
    [tab]
  );

  const stackImages = useMemo<Record<TabType, string[]>>(
    () => ({
      founders: ['/assets/images/step-1.jpg'],
      investors: ['/assets/images/step-2.jpg'],
    }),
    []
  );

  const flipVariants = {
    initial: (dir: number) => ({
      rotateY: dir > 0 ? -12 : 12,
      z: 0,
      opacity: 0,
      scale: 0.96,
    }),
    enter: {
      rotateY: 0,
      z: 40,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 120, damping: 18 },
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? 12 : -12,
      z: 0,
      opacity: 0,
      scale: 0.97,
      transition: { duration: 0.25 },
    }),
  };

  const dir = tab === 'founders' ? 1 : -1;

  return (
    <section className='relative isolate py-20 sm:py-24'>
      {/* Subtle top gradient */}
      <div className='pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-violet-50 to-white' />

      <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h2 className='text-3xl sm:text-4xl font-ibm font-semibold tracking-tight text-gray-900'>
            How it Works
          </h2>

          {/* Tabs */}
          <div className='mt-4 inline-flex items-center gap-2 rounded-full bg-white p-1 shadow-inner'>
            <button
              onClick={() => setTab('founders')}
              className={`${pillBase} ${
                tab === 'founders'
                  ? 'border border-[#E5E5E5] bg-[#F5F5F5] text-gray-900 shadow-[inset_0_3px_3px_rgba(255,255,255,0.4),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)]'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ShieldUser size={20} />
              For Founders
            </button>

            <button
              onClick={() => setTab('investors')}
              className={`${pillBase} ${
                tab === 'investors'
                  ? 'border border-[#E5E5E5] bg-[#F5F5F5] text-gray-900 shadow-[inset_0_3px_3px_rgba(255,255,255,0.4),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)]'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Camera size={20} />
              For Investors
            </button>
          </div>
        </div>

        {/* Visual + Steps */}
        <div className='mt-10 grid w-full grid-cols-1 place-items-center'>
          {/* Stack container */}
          <div className='relative w-full max-w-2xl'>
            {tab === 'founders' ? (
              <div className='absolute -right-6 top-6 hidden h-[400px] w-[420px] rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 md:block backdrop-blur-sm opacity-70 scale-95'>
                <Image
                  src={stackImages['investors'][0]}
                  alt='Investors preview'
                  fill
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-white/50 backdrop-blur-sm' />
              </div>
            ) : (
              <div className='absolute -right-6 top-6 hidden h-[400px] w-[420px] rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 md:block backdrop-blur-sm opacity-70 scale-95'>
                <Image
                  src={stackImages['founders'][0]}
                  alt='Founders preview'
                  fill
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-white/50 backdrop-blur-sm' />
              </div>
            )}

            {/* Animated front card */}
            <AnimatePresence mode='popLayout' initial={false} custom={dir}>
              <motion.div
                key={tab}
                custom={dir}
                variants={flipVariants}
                initial='initial'
                animate='enter'
                exit='exit'
                style={{ transformStyle: 'preserve-3d' }}
                className='relative z-10 overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-xl bg-white/90 backdrop-blur-sm'
              >
                {/* Background image */}
                <div className='relative h-[400px] w-full'>
                  <Image
                    src={stackImages[tab][0]}
                    alt='Illustration'
                    fill
                    className='object-cover'
                  />

                  {/* frosted overlay top */}
                  <div className='absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white/10' />

                  {/* Step cards */}
                  <div className='absolute inset-0 flex flex-col justify-center gap-3 p-4 sm:p-6'>
                    {steps.map((s, i) => (
                      <div
                        key={i}
                        className='flex items-start gap-3 rounded-xl bg-white/95 px-4 py-3 shadow-sm ring-1 ring-black/5 backdrop-blur'
                      >
                        <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500 text-white text-[13px] font-semibold'>
                          {i + 1}
                        </div>
                        <div className='min-w-0'>
                          <p className='font-geist text-gray-900 text-[15px] leading-tight'>
                            {s.title}
                          </p>
                          <p className='mt-0.5 text-[12px] text-gray-600 leading-snug'>
                            {s.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
