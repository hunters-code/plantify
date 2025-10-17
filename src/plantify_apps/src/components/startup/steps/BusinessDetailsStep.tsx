'use client';

import React, { ChangeEvent } from 'react';

import { StartupFormData } from '../types';

interface BusinessDetailsStepProps {
  formData: StartupFormData;
  setFormData: (field: string, value: string, shouldValidate?: boolean) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

const BusinessDetailsStep: React.FC<BusinessDetailsStepProps> = ({
  formData,
  setFormData,
  errors = {},
  touched: _touched = {},
}) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(name, value);
  };

  const inputStyle =
    'w-full flex items-center gap-[6px] px-4 py-3 rounded-[12px] border border-[#E5E5E5] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.16)] text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-[16px]';

  return (
    <div className='space-y-6'>
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold font-ibm text-gray-900 mb-2'>
          Business Model & Strategy
        </h2>
      </div>

      <div className='space-y-6'>
        {/* Problem Statement */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Problem Statement <span className='text-red-500'>*</span>
          </label>
          <textarea
            name='problemStatement'
            value={formData.problemStatement || ''}
            onChange={handleChange}
            rows={4}
            placeholder='What problem does your startup solve?'
            className={`${inputStyle} resize-none ${errors.problemStatement ? 'border-red-500' : ''}`}
            required
          />
          {errors.problemStatement && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.problemStatement}
            </p>
          )}
        </div>

        {/* Solution */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Solution <span className='text-red-500'>*</span>
          </label>
          <textarea
            name='solution'
            value={formData.solution || ''}
            onChange={handleChange}
            rows={4}
            placeholder='How does your product/service solve this problem?'
            className={`${inputStyle} resize-none ${errors.solution ? 'border-red-500' : ''}`}
            required
          />
          {errors.solution && (
            <p className='mt-1 text-sm text-red-600'>{errors.solution}</p>
          )}
        </div>

        {/* Target Market */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Target market <span className='text-red-500'>*</span>
          </label>
          <textarea
            name='targetMarket'
            value={formData.targetMarket || ''}
            onChange={handleChange}
            rows={4}
            placeholder='Who are your target customers?'
            className={`${inputStyle} resize-none ${errors.targetMarket ? 'border-red-500' : ''}`}
            required
          />
          {errors.targetMarket && (
            <p className='mt-1 text-sm text-red-600'>{errors.targetMarket}</p>
          )}
        </div>

        {/* Competitive Advantage */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Competitive Advantage <span className='text-red-500'>*</span>
          </label>
          <textarea
            name='competitiveAdvantage'
            value={formData.competitiveAdvantage || ''}
            onChange={handleChange}
            rows={4}
            placeholder='What makes your startup unique?'
            className={`${inputStyle} resize-none ${errors.competitiveAdvantage ? 'border-red-500' : ''}`}
            required
          />
          {errors.competitiveAdvantage && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.competitiveAdvantage}
            </p>
          )}
        </div>

        {/* Marketing Strategy */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Marketing Strategy <span className='text-red-500'>*</span>
          </label>
          <textarea
            name='marketingStrategy'
            value={formData.marketingStrategy || ''}
            onChange={handleChange}
            rows={4}
            placeholder='How will you reach and acquire customers?'
            className={`${inputStyle} resize-none ${errors.marketingStrategy ? 'border-red-500' : ''}`}
            required
          />
          {errors.marketingStrategy && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.marketingStrategy}
            </p>
          )}
        </div>

        {/* Operational Process */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Operational Process <span className='text-red-500'>*</span>
          </label>
          <textarea
            name='operationalProcess'
            value={formData.operationalProcess || ''}
            onChange={handleChange}
            rows={4}
            placeholder='Describe your key operational processes'
            className={`${inputStyle} resize-none ${errors.operationalProcess ? 'border-red-500' : ''}`}
            required
          />
          {errors.operationalProcess && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.operationalProcess}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsStep;
