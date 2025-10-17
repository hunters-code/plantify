import React, { useState, useEffect } from 'react';

import { Input, Select } from '@/components/ui';
import {
  INVESTMENT_EXPERIENCE_OPTIONS,
  RISK_TOLERANCE_OPTIONS,
  INVESTMENT_GOAL_OPTIONS,
  CAPITAL_OPTIONS,
} from '@/constants/investmentOptions';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  investmentExperience: string;
  riskTolerance: string;
  investmentGoals: string;
  availableCapital: string;
  monthlyBudget: string;
  investmentRisks: boolean;
  nftModel: boolean;
  governance: boolean;
  liquidity: boolean;
  terms: boolean;
  risks: boolean;
  transparency: boolean;
}

type InvestmentField =
  | 'investmentExperience'
  | 'riskTolerance'
  | 'investmentGoals'
  | 'availableCapital'
  | 'monthlyBudget';

interface InvestmentProfileProps {
  formData: Pick<
    FormData,
    | 'investmentExperience'
    | 'riskTolerance'
    | 'investmentGoals'
    | 'availableCapital'
    | 'monthlyBudget'
  >;
  handleInputChange: <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => void;
}

export default function InvestmentProfile({
  formData,
  handleInputChange,
}: InvestmentProfileProps) {
  const [errors, setErrors] = useState<Record<InvestmentField, string>>({
    investmentExperience: '',
    riskTolerance: '',
    investmentGoals: '',
    availableCapital: '',
    monthlyBudget: '',
  });

  const [touched, setTouched] = useState<Record<InvestmentField, boolean>>({
    investmentExperience: false,
    riskTolerance: false,
    investmentGoals: false,
    availableCapital: false,
    monthlyBudget: false,
  });

  const handleChange = (field: InvestmentField, value: string) => {
    handleInputChange(field, value);
  };

  const handleBlur = (field: InvestmentField) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateField = (field: InvestmentField, value: string): string => {
    let error = '';

    switch (field) {
      case 'investmentExperience':
        if (!value) error = 'Investment experience is required';
        break;
      case 'riskTolerance':
        if (!value) error = 'Risk tolerance is required';
        break;
      case 'investmentGoals':
        if (!value) error = 'Investment goals are required';
        break;
      case 'availableCapital':
        if (!value) error = 'Available capital is required';
        break;
      case 'monthlyBudget':
        if (!value?.trim()) error = 'Monthly budget is required';
        else if (!/^\$?\d+(\.\d{2})?$/.test(value.trim())) {
          error = 'Please enter a valid amount (e.g., $100 or 100)';
        }
        break;
    }

    return error;
  };

  useEffect(() => {
    const newErrors: Record<InvestmentField, string> = {
      investmentExperience: touched.investmentExperience
        ? validateField(
            'investmentExperience',
            formData.investmentExperience || ''
          )
        : '',
      riskTolerance: touched.riskTolerance
        ? validateField('riskTolerance', formData.riskTolerance || '')
        : '',
      investmentGoals: touched.investmentGoals
        ? validateField('investmentGoals', formData.investmentGoals || '')
        : '',
      availableCapital: touched.availableCapital
        ? validateField('availableCapital', formData.availableCapital || '')
        : '',
      monthlyBudget: touched.monthlyBudget
        ? validateField('monthlyBudget', formData.monthlyBudget || '')
        : '',
    };
    setErrors(newErrors);
  }, [formData, touched]);

  return (
    <div>
      <h2 className='text-2xl font-semibold text-gray-900 mb-2 font-ibm'>
        Investment Profile
      </h2>
      <p className='text-gray-600 mb-8'>
        Help us understand your investment background and preferences. Fields
        marked with * are required.
      </p>

      <div className='space-y-6'>
        <Select
          label='Investment Experience Level'
          value={formData.investmentExperience || ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            handleChange('investmentExperience', e.target.value)
          }
          onBlur={() => handleBlur('investmentExperience')}
          options={INVESTMENT_EXPERIENCE_OPTIONS}
          placeholder='Select your experience level'
          required
          error={errors.investmentExperience}
        />

        <Select
          label='Risk Tolerance'
          value={formData.riskTolerance || ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            handleChange('riskTolerance', e.target.value)
          }
          onBlur={() => handleBlur('riskTolerance')}
          options={RISK_TOLERANCE_OPTIONS}
          placeholder='Select your risk tolerance'
          required
          error={errors.riskTolerance}
        />

        <Select
          label='Primary Investment Goals'
          value={formData.investmentGoals || ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            handleChange('investmentGoals', e.target.value)
          }
          onBlur={() => handleBlur('investmentGoals')}
          options={INVESTMENT_GOAL_OPTIONS}
          placeholder='Select your primary goal'
          required
          error={errors.investmentGoals}
        />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Select
            label='Available Investment Capital'
            value={formData.availableCapital || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleChange('availableCapital', e.target.value)
            }
            onBlur={() => handleBlur('availableCapital')}
            options={CAPITAL_OPTIONS}
            placeholder='Select capital range'
            required
            error={errors.availableCapital}
          />

          <Input
            type='text'
            label='Monthly Investment Budget'
            placeholder='e.g., $100'
            value={formData.monthlyBudget || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange('monthlyBudget', e.target.value)
            }
            onBlur={() => handleBlur('monthlyBudget')}
            required
            error={errors.monthlyBudget}
          />
        </div>
      </div>

      <div className='mt-8 p-4 bg-green-50 border border-green-200 rounded-lg'>
        <div className='flex items-start gap-3'>
          <svg
            className='w-5 h-5 text-green-600 mt-0.5 flex-shrink-0'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <div>
            <h4 className='font-semibold text-green-900 text-sm mb-1'>
              Investment Matching
            </h4>
            <p className='text-green-800 text-sm'>
              Your investment profile helps us recommend startups that align
              with your goals, risk tolerance, and available capital. This
              ensures better investment outcomes for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
