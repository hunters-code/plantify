import {
  ShieldCheck,
  Users,
  Coins,
  ClipboardCheck,
  Globe,
  HandCoins,
} from 'lucide-react';
import React from 'react';

import { Logo } from '@/components/icons';
import Button from '@/components/ui/Button';

const features = [
  {
    icon: <ShieldCheck size={18} className='text-white' />,
    title: 'Triple Protection',
    desc: 'Founder collateral, platform reserves, and community governance.',
  },
  {
    icon: <ClipboardCheck size={18} className='text-white' />,
    title: 'Complete Transparency',
    desc: 'On-chain transactions with public reporting.',
  },
  {
    icon: <Users size={18} className='text-white' />,
    title: 'Community Driven',
    desc: 'Monthly voting with transparent governance.',
  },
  {
    icon: <Globe size={18} className='text-white' />,
    title: 'Fully Decentralized',
    desc: 'Built on the Internet Computer blockchain.',
  },
  {
    icon: <Coins size={18} className='text-white' />,
    title: 'Stable Currency',
    desc: 'All transactions in ckUSDC ensure predictable returns.',
  },
  {
    icon: <HandCoins size={18} className='text-white' />,
    title: 'Low Entry Barrier',
    desc: 'Start investing with just $50 per NFT.',
  },
];

export default function WhyPlantify({ withoutCta = false }) {
  return (
    <section className='relative isolate'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10'>
        <h2 className='text-center font-ibm text-2xl sm:text-3xl font-semibold text-gray-900'>
                    Why Plantify?
        </h2>
      </div>

      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-6'>
        <div
          className='relative rounded-3xl shadow-xl ring-1 ring-black/5 overflow-hidden p-24'
          style={{
            backgroundImage: 'url(/assets/images/house.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className='absolute inset-0 bg-gradient-to-b from-white/70 via-white/30 to-white/10' />
          <div className='pointer-events-none absolute inset-x-6 bottom-0 h-8 rounded-t-[24px] bg-black/10 blur-[6px]' />

          <div className='relative p-3 sm:p-5'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
              {features.map(f => (
                <div
                  key={f.title}
                  className='flex items-start gap-3 rounded-xl bg-white/90 backdrop-blur-sm px-4 py-3 shadow-sm ring-1 ring-black/5'
                >
                  <span className='inline-flex h-7 w-7 items-center justify-center rounded-full bg-purple-500 text-white'>
                    {f.icon}
                  </span>
                  <div className='min-w-0'>
                    <p className='font-geist text-[15px] font-semibold text-gray-900 leading-tight'>
                      {f.title}
                    </p>
                    <p className='mt-0.5 text-[12px] text-gray-600 leading-snug'>
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA (conditionally render) */}
      {!withoutCta && (
        <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-10 mb-12'>
          <div
            className='relative overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5'
            style={{
              backgroundImage: 'url(/assets/images/bg-cta.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className='absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-white/5' />

            <div className='relative px-6 sm:px-10 py-10 sm:py-14 text-center'>
              <div className='flex justify-center'>
                <Logo className="w-12 h-8" />
              </div>

              <h3 className='font-ibm text-[28px] sm:text-[32px] text-gray-900'>
                                Ready to Start?
              </h3>
              <p className='mt-1 text-[13px] sm:text-sm text-gray-700'>
                                Join thousands of investors earning stable returns from startup
              </p>

              <div className='mt-5 flex flex-col sm:flex-row items-center justify-center gap-3'>
                <Button
                  as='a'
                  href='#invest'
                  variant='primary'
                  className='px-4'
                >
                                    Start Investing
                </Button>
                <Button
                  as='a'
                  href='#register'
                  variant='secondary'
                  className='px-4'
                >
                                    Register Startup
                </Button>
              </div>
            </div>

            <div className='pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/15 to-transparent' />
          </div>
        </div>
      )}
    </section>
  );
}
