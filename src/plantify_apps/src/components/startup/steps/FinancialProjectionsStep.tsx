'use client';

import React, { useEffect } from 'react';

import { Input, Textarea } from '@/components/ui';

import { StartupFormData } from '../types';

interface FinancialProjectionsStepProps {
  formData: StartupFormData;
  setFormData: React.Dispatch<React.SetStateAction<StartupFormData>>;
  errors: Record<string, string>;
}

const FinancialProjectionsStep: React.FC<FinancialProjectionsStepProps> = ({
  formData,
  setFormData,
  errors = {},
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (formData.fundingGoal) {
      const fundingGoal = parseFloat(formData.fundingGoal) || 0;
      const nftPrice = fundingGoal / 100; 
      setFormData(prev => ({
        ...prev,
        nftPrice: nftPrice.toString(),
      }));
    }
  }, [formData.fundingGoal, setFormData]);

  return (
    <div className='space-y-6'>
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold font-ibm text-gray-900 mb-2'>
          Financial Projections & Funding
        </h2>
      </div>

      <div className='space-y-6'>
        {/* Funding Goal and NFT Price */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Input
            type='number'
            name='fundingGoal'
            label='Funding goal (ckUSDC)'
            value={formData.fundingGoal || ''}
            onChange={handleChange}
            placeholder='0'
            min='1000'
            required
            error={errors.fundingGoal}
          />

          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              NFT Price (ckUSDC) - auto calculated
            </label>
            <input
              type='number'
              name='nftPrice'
              value={formData.nftPrice || ''}
              readOnly
              placeholder='100'
              className='w-full px-4 py-3 rounded-[12px] border border-[#E5E5E5] bg-gray-50 text-gray-600 text-[16px]'
            />
            <p className='mt-1 text-xs text-gray-500'>
              Auto-calculated based on funding goal. You can adjust manually.
            </p>
          </div>
        </div>

        {/* Monthly Profit Sharing and Revenue */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Input
            type='number'
            name='monthlyProfitSharing'
            label='Monthly profit sharing commitment (ckUSDC per NFT)'
            value={formData.monthlyProfitSharing || ''}
            onChange={handleChange}
            placeholder='0'
            min='0'
            required
            error={errors.monthlyProfitSharing}
          />

          <Input
            type='number'
            name='expectedMonthlyRevenue'
            label='Expected monthly revenue (ckUSDC)'
            value={formData.expectedMonthlyRevenue || ''}
            onChange={handleChange}
            placeholder='0'
            min='0'
            required
            error={errors.expectedMonthlyRevenue}
          />
        </div>

        {/* Expected Monthly Expenses and Break-even Month */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Input
            type='number'
            name='expectedMonthlyExpenses'
            label='Expected monthly expenses (ckUSDC)'
            value={formData.expectedMonthlyExpenses || ''}
            onChange={handleChange}
            placeholder='0'
            min='0'
          />

          <Input
            type='number'
            name='breakEvenMonth'
            label='Break-even month'
            value={formData.breakEvenMonth || ''}
            onChange={handleChange}
            placeholder='0'
            min='1'
            required
            error={errors.breakEvenMonth}
          />
        </div>

        {/* Revenue Model */}
        <Textarea
          name='revenueModel'
          label='Revenue model'
          value={formData.revenueModel || ''}
          onChange={handleChange}
          rows={4}
          placeholder='How will your startup generate revenue?'
          required
          error={errors.revenueModel}
        />

        {/* Use of Funds */}
        <Textarea
          name='useOfFunds'
          label='Use of funds'
          value={formData.useOfFunds || ''}
          onChange={handleChange}
          rows={4}
          placeholder='How will you use the raised funds?&#10;e.g. 40% marketing, 30% operations, 20% equipment, 10% working capital'
          required
          error={errors.useOfFunds}
        />
      </div>
    </div>
  );
};

export default FinancialProjectionsStep;
