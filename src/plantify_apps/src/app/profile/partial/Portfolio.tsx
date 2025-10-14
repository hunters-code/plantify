'use client';

import { CheckCircle } from 'lucide-react';

export default function Portfolio() {
  const investmentStats = [
    { label: 'Total Invested', value: '$2,450' },
    { label: 'Current Value', value: '$2,637' },
    { label: 'Total Return', value: '$187' },
  ];

  const startups = [
    {
      name: 'EcoFarm Solutions',
      status: 'Active',
      nfts: 10,
      invested: '$500',
      returns: '+$45 returns',
    },
    {
      name: 'SmartCafe Tech',
      status: 'Active',
      nfts: 6,
      invested: '$300',
      returns: '+$33 returns',
    },
    {
      name: 'GreenFarm Organics',
      status: 'Active',
      nfts: 4,
      invested: '$200',
      returns: '+$18 returns',
    },
  ];

  const sectors = [
    { label: 'Agriculture', amount: '$1,100', percent: 45 },
    { label: 'Technology', amount: '$750', percent: 30 },
    { label: 'Food & Beverage', amount: '$400', percent: 15 },
    { label: 'Service', amount: '$200', percent: 10 },
  ];

  return (
    <div className='mx-auto space-y-6'>
      {/* Investment Statistics */}
      <section className='bg-white p-6 rounded-2xl'>
        <h2 className='text-xl font-semibold mb-4'>Investment Statistics</h2>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {investmentStats.map(stat => (
            <div
              key={stat.label}
              className='bg-white p-4 rounded-xl border border-gray-100'
            >
              <p className='text-gray-500 text-xs'>{stat.label}</p>
              <p className='text-base font-semibold mt-1'>{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Startup Investments */}
      <section className='bg-white p-6 rounded-2xl'>
        <h2 className='text-xl font-semibold mb-4'>Startup Investments</h2>
        <div className='space-y-4'>
          {startups.map(startup => (
            <div
              key={startup.name}
              className='flex justify-between items-center bg-white p-4 rounded-lg border-b border-gray-100 pb-3 last:border-0'
            >
              <div className='flex items-center gap-3'>
                <CheckCircle className='text-green-500' size={20} />
                <div>
                  <p className='font-medium text-gray-800 text-sm'>
                    {startup.name}
                  </p>
                  <div className='flex gap-2 items-center text-xs mt-1'>
                    <span className='bg-green-100 text-green-700 px-2 py-0.5 rounded-full'>
                      {startup.status}
                    </span>
                    <span className='text-gray-500'>{startup.nfts} NFTs</span>
                  </div>
                </div>
              </div>
              <div className='text-right'>
                <p className='font-medium text-sm text-gray-800'>
                  {startup.invested}
                </p>
                <p className='text-xs text-green-600'>{startup.returns}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sector Allocation */}
      <section className='bg-white p-6 rounded-2xl'>
        <h2 className='text-xl font-semibold mb-4'>Sector Allocation</h2>
        <div className='space-y-4'>
          {sectors.map(sector => (
            <div className='bg-white p-4 rounded-lg' key={sector.label}>
              <div className='flex justify-between text-sm font-medium text-gray-700'>
                <span>{sector.label}</span>
                <span>{sector.percent}%</span>
              </div>
              <div className='w-full bg-gray-100 h-2 rounded-full mt-1'>
                <div
                  className='bg-green-500 h-2 rounded-full'
                  style={{ width: `${sector.percent}%` }}
                />
              </div>
              <p className='text-xs text-gray-500 mt-1'>{sector.amount}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
