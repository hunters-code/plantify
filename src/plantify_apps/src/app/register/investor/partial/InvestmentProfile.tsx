import React from 'react';

import { Input, Select } from '@/components/ui';

interface InvestmentProfileProps {
  formData: {
    investmentExperience?: string;
    riskTolerance?: string;
    investmentGoals?: string;
    availableCapital?: string;
    monthlyBudget?: string;
  };
  handleInputChange?: (field: string, value: string) => void;
}

interface Option {
  value: string;
  label: string;
}

export default function InvestmentProfile({
  formData,
  handleInputChange,
}: InvestmentProfileProps) {
  const handleChange = (field: string, value: string) => {
    if (handleInputChange) {
      handleInputChange(field, value);
    }
  };

  const experienceOptions: Option[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'expert', label: 'Expert' },
  ];

  const riskOptions: Option[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const goalOptions: Option[] = [
    { value: 'growth', label: 'Growth' },
    { value: 'income', label: 'Income' },
    { value: 'preservation', label: 'Capital Preservation' },
  ];

  const capitalOptions: Option[] = [
    { value: 'under_1k', label: 'Under $1,000' },
    { value: '1k_10k', label: '$1,000 - $10,000' },
    { value: '10k_100k', label: '$10,000 - $100,000' },
    { value: '100k_plus', label: '$100,000+' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-8 font-ibm">
        Investment Profile
      </h2>

      <div className="space-y-6">
        <Select
          label="Investment Experience Level"
          value={formData.investmentExperience || ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            handleChange('investmentExperience', e.target.value)
          }
          options={experienceOptions}
          placeholder="Select your experience level"
          required
        />

        <Select
          label="Risk Tolerance"
          value={formData.riskTolerance || ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            handleChange('riskTolerance', e.target.value)
          }
          options={riskOptions}
          placeholder="Select your risk tolerance"
          required
        />

        <Select
          label="Primary Investment Goals"
          value={formData.investmentGoals || ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            handleChange('investmentGoals', e.target.value)
          }
          options={goalOptions}
          placeholder="Select your primary goal"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Available Investment Capital"
            value={formData.availableCapital || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleChange('availableCapital', e.target.value)
            }
            options={capitalOptions}
            placeholder="Select capital range"
            required
          />

          <Input
            type="text"
            label="Monthly Investment Budget"
            placeholder="e.g. $100"
            value={formData.monthlyBudget || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange('monthlyBudget', e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
}
