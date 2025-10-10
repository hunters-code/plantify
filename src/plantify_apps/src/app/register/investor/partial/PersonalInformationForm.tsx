import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui';

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

interface PersonalInformationFormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
}

interface PersonalInformationFormProps {
  formData: PersonalInformationFormData;
  handleInputChange: <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => void;
}

export default function PersonalInformationForm({
  formData,
  handleInputChange,
}: PersonalInformationFormProps) {
  const [errors, setErrors] = useState<
    Record<keyof PersonalInformationFormData, string>
  >({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
  });

  const [touched, setTouched] = useState<
    Record<keyof PersonalInformationFormData, boolean>
  >({
    fullName: false,
    email: false,
    phone: false,
    country: false,
    city: false,
  });

  // Validate individual fields
  const validateField = (
    field: keyof PersonalInformationFormData,
    value: string
  ): string => {
    let error = '';

    switch (field) {
      case 'fullName':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 3) {
          error = 'Full name must be at least 3 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Full name can only contain letters and spaces';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!/^[\d+\-\s()]+$/.test(value)) {
          error = 'Please enter a valid phone number';
        } else if (value.replace(/\D/g, '').length < 10) {
          error = 'Phone number must be at least 10 digits';
        }
        break;

      case 'country':
        if (!value.trim()) {
          error = 'Country is required';
        } else if (value.trim().length < 2) {
          error = 'Please enter a valid country name';
        }
        break;

      case 'city':
        if (!value.trim()) {
          error = 'City is required';
        } else if (value.trim().length < 2) {
          error = 'Please enter a valid city name';
        }
        break;
    }

    return error;
  };

  // Update errors when formData changes
  useEffect(() => {
    const newErrors: Record<keyof PersonalInformationFormData, string> = {
      fullName: touched.fullName
        ? validateField('fullName', formData.fullName)
        : '',
      email: touched.email ? validateField('email', formData.email) : '',
      phone: touched.phone ? validateField('phone', formData.phone) : '',
      country: touched.country
        ? validateField('country', formData.country)
        : '',
      city: touched.city ? validateField('city', formData.city) : '',
    };
    setErrors(newErrors);
  }, [formData, touched]);

  const handleBlur = (field: keyof PersonalInformationFormData): void => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleChange = (
    field: keyof PersonalInformationFormData,
    value: string
  ): void => {
    handleInputChange(field as keyof FormData, value);
  };

  return (
    <div>
      <h2 className='text-2xl font-semibold font-ibm text-gray-900 mb-2'>
        Personal Information
      </h2>
      <p className='text-gray-600 mb-8'>
        Please provide your personal details. All fields marked with * are
        required.
      </p>

      <div className='space-y-6'>
        <Input
          type='text'
          label='Full name'
          placeholder='Enter your full name here'
          value={formData.fullName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange('fullName', e.target.value)
          }
          onBlur={() => handleBlur('fullName')}
          required
          error={errors.fullName}
        />

        <div className='grid md:grid-cols-2 gap-6'>
          <Input
            type='email'
            label='Email'
            placeholder='example@email.com'
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange('email', e.target.value)
            }
            onBlur={() => handleBlur('email')}
            required
            error={errors.email}
          />
          <Input
            type='tel'
            label='Phone number'
            placeholder='+62 812 3456 7890'
            value={formData.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange('phone', e.target.value)
            }
            onBlur={() => handleBlur('phone')}
            required
            error={errors.phone}
          />
        </div>

        <div className='grid md:grid-cols-2 gap-6'>
          <Input
            type='text'
            label='Country'
            placeholder='e.g., Indonesia'
            value={formData.country}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange('country', e.target.value)
            }
            onBlur={() => handleBlur('country')}
            required
            error={errors.country}
          />
          <Input
            type='text'
            label='City'
            placeholder='e.g., Jakarta'
            value={formData.city}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange('city', e.target.value)
            }
            onBlur={() => handleBlur('city')}
            required
            error={errors.city}
          />
        </div>
      </div>

      <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
        <div className='flex items-start gap-3'>
          <svg
            className='w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <div>
            <h4 className='font-semibold text-blue-900 text-sm mb-1'>
              Privacy & Security
            </h4>
            <p className='text-blue-800 text-sm'>
              Your personal information is encrypted and stored securely. We
              will never share your data with third parties without your
              consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
