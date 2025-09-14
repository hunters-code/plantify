'use client';

import { Calendar, CalendarDays, TrendingUp } from 'lucide-react';

export default function Financials() {
  const performance = [
    {
      month: 'Aug 2024',
      revenue: 14500,
      expenses: 7800,
      profit: 6700,
      margin: 46.2,
    },
    {
      month: 'Jul 2024',
      revenue: 13400,
      expenses: 7400,
      profit: 6000,
      margin: 44.8,
    },
    {
      month: 'Jun 2024',
      revenue: 12100,
      expenses: 7100,
      profit: 5000,
      margin: 41.3,
    },
    {
      month: 'May 2024',
      revenue: 12100,
      expenses: 7100,
      profit: 4400,
      margin: 39.3,
    },
    {
      month: 'Apr 2024',
      revenue: 9800,
      expenses: 6200,
      profit: 3600,
      margin: 36.7,
    },
    {
      month: 'Mar 2024',
      revenue: 8200,
      expenses: 5800,
      profit: 2400,
      margin: 29.3,
    },
  ];

  return (
    <div className='space-y-8'>
      {/* Financial Performance */}
      <div className='rounded-2xl bg-neutral-100 p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <h3 className='text-4xl font-semibold font-ibm'>
            Financial Performance
          </h3>
          <span className='flex items-center gap-2 text-xs text-red-600 bg-red-100 border border-red-200 px-3 py-1 rounded-lg'>
            <Calendar size={14} /> Last 6 months
          </span>
        </div>
        <div className='space-y-4'>
          {performance.map((item, i) => (
            <div
              key={i}
              className='p-4 border border-gray-200 rounded-[16px] bg-neutral-50'
            >
              <div className='flex justify-between items-center'>
                <div className='flex gap-2 items-center'>
                  <CalendarDays size={20} className='text-neutral-600' />
                  <span className='text-[16px] text-neutral-600'>
                    {item.month}
                  </span>
                </div>
                <div className='flex items-center gap-2 text-green-600'>
                  <div className='flex gap-2 items-center'>
                    <span className='text-[16px] text-neutral-600'>
                      Profit:
                    </span>
                    <span className='font-ibm text-[18px] font-semibold'>
                      ${item.profit.toLocaleString()}
                    </span>
                  </div>
                  <span className='text-sm text-green-600 font-medium bg-green-100 border-2 border-green-200 px-2 py-1 rounded-lg flex gap-1 items-center'>
                    <div className='bg-green-600 rounded-full w-fit p-1'>
                      <TrendingUp size={15} className='text-white' />
                    </div>
                    22% Profit margin
                  </span>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4 text-sm text-gray-700 mt-1 bg-neutral-100 py-2 px-3 rounded-full'>
                <div>
                  <span className='text-[16px]'>Revenue: </span>
                  <span className='font-medium text-[16px]'>
                    ${item.revenue.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className='text-[16px]'>Expenses: </span>
                  <span className='text-red-600 text-[18px] font-medium'>
                    ${item.expenses.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Investor Profit Sharing */}
      <div className='bg-neutral-100 rounded-2xl p-6 border border-gray-200'>
        <div className='flex items-center gap-3 mb-4'>
          <h3 className='text-4xl font-semibold font-ibm'>
            Investor Profit Sharing Model
          </h3>
          <span className='flex items-center gap-2 text-xs text-red-600 bg-red-100 border border-red-200 px-3 py-1 rounded-lg'>
            <Calendar size={14} /> Last 6 months
          </span>
        </div>

        <div className='space-y-3 text-sm text-gray-700 bg-white p-4 rounded-xl'>
          <span className='text-xl font-ibm font-semibold'>
            How profit sharing works
          </span>
          <p>• 70% of monthly net profit distributed to NFT holders</p>
          <p>• 30% retained by company for growth and operations</p>
          <p>• Payments distributed on 1st of each month</p>
          <p>• Profit sharing locked for 36 months</p>
          <p>• Transparent reporting with monthly financial statements</p>
        </div>

        {/* Expected Distribution */}
        <div className='mt-6 bg-neutral-50 p-4 rounded-xl'>
          <p className='text-xl text-gray-600 font-ibm'>
            Expected Monthly Distribution
          </p>
          <div className='bg-neutral-100 p-3 rounded-xl'>
            <p className='text-sm text-neutral-400 mt-1'>
              Based on current performance:
            </p>
            <div className='text-2xl font-semibold mt-1'>
              <span className='font-ibm'>$12</span>{' '}
              <span className='text-sm font-normal text-neutral-600'>
                per NFT
              </span>
            </div>
            <p className='text-sm text-neutral-400 mt-1'>
              From latest month net profit of $6,700
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
