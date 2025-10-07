'use client';

import {
  Calendar,
  CalendarDays,
  TrendingUp,
  DollarSign,
  FileText,
} from 'lucide-react';

export default function Financials({ startup }) {
  if (!startup) {
    return (
      <div className='space-y-8'>
        <p className='text-gray-500'>Loading financial information...</p>
      </div>
    );
  }

  // Calculate profit margin if both revenue and expenses are available
  const monthlyRevenue = parseFloat(startup.monthlyRevenue) || 0;
  const monthlyExpenses = parseFloat(startup.monthlyExpenses) || 0;
  const monthlyProfit = monthlyRevenue - monthlyExpenses;
  const profitMargin =
    monthlyRevenue > 0
      ? ((monthlyProfit / monthlyRevenue) * 100).toFixed(1)
      : 0;

  return (
    <div className='space-y-8'>
      {/* Financial Overview */}
      <div className='rounded-2xl bg-neutral-100 p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <h3 className='text-4xl font-semibold font-ibm'>
            Financial Overview
          </h3>
          <span className='flex items-center gap-2 text-xs text-blue-600 bg-blue-100 border border-blue-200 px-3 py-1 rounded-lg'>
            <DollarSign size={14} /> Current Data
          </span>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <div className='bg-white rounded-lg p-4 shadow-sm'>
            <h4 className='text-sm text-gray-500 mb-2'>Monthly Revenue</h4>
            <p className='text-2xl font-semibold text-green-600'>
              ${monthlyRevenue.toLocaleString()}
            </p>
          </div>
          <div className='bg-white rounded-lg p-4 shadow-sm'>
            <h4 className='text-sm text-gray-500 mb-2'>Monthly Expenses</h4>
            <p className='text-2xl font-semibold text-red-600'>
              ${monthlyExpenses.toLocaleString()}
            </p>
          </div>
          <div className='bg-white rounded-lg p-4 shadow-sm'>
            <h4 className='text-sm text-gray-500 mb-2'>Monthly Profit</h4>
            <p
              className={`text-2xl font-semibold ${monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              ${monthlyProfit.toLocaleString()}
            </p>
            {profitMargin > 0 && (
              <p className='text-sm text-gray-500 mt-1'>
                {profitMargin}% margin
              </p>
            )}
          </div>
        </div>

        {startup.financialProjections &&
          startup.financialProjections.length > 0 && (
          <div className='bg-white rounded-lg p-4'>
            <h4 className='text-lg font-medium mb-3 flex items-center gap-2'>
              <FileText size={18} className='text-blue-500' />
                Financial Projections
            </h4>
            <p className='text-gray-600 text-sm'>
              {startup.financialProjections[0]}
            </p>
          </div>
        )}
      </div>

      {/* Investment Information */}
      <div className='bg-neutral-100 rounded-2xl p-6 border border-gray-200'>
        <div className='flex items-center gap-3 mb-4'>
          <h3 className='text-4xl font-semibold font-ibm'>
            Investment Information
          </h3>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='bg-white rounded-lg p-4'>
            <h4 className='text-lg font-medium mb-3'>Funding Details</h4>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Funding Goal:</span>
                <span className='font-semibold'>
                  ${startup.fundingGoal || '0'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>NFT Price:</span>
                <span className='font-semibold'>
                  ${startup.nftPrice || '0'} ckUSDC
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Company Type:</span>
                <span className='font-semibold'>
                  {startup.companyType || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg p-4'>
            <h4 className='text-lg font-medium mb-3'>Profit Sharing</h4>
            <div className='space-y-2'>
              {startup.periodicProfitSharing ? (
                <p className='text-sm text-gray-600'>
                  {startup.periodicProfitSharing}
                </p>
              ) : (
                <div className='space-y-1 text-sm text-gray-600'>
                  <p>
                    • Profit sharing details will be available after funding
                  </p>
                  <p>• Returns based on company performance</p>
                  <p>• Transparent monthly reporting</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {startup.useOfFunds && (
          <div className='mt-4 bg-white rounded-lg p-4'>
            <h4 className='text-lg font-medium mb-3'>Use of Funds</h4>
            <p className='text-gray-600 text-sm'>{startup.useOfFunds}</p>
          </div>
        )}
      </div>
    </div>
  );
}
