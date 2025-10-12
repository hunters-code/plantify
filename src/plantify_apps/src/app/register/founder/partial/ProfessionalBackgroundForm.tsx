import { useState, useEffect } from 'react';

import { Input, Textarea } from '@/components/ui';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
  previousBusinesses: string;
  expertise: string;
  linkedIn: string;
  idNumber: string;
  taxNumber: string;
  terms: boolean;
  risks: boolean;
  transparency: boolean;
}

interface ProfessionalBackgroundFormProps {
  formData: {
    experience?: string;
    previousBusinesses?: string;
    expertise?: string;
    linkedIn?: string;
  };
  handleInputChange: (field: keyof FormData, value: any) => void;
}

export default function ProfessionalBackgroundForm({
  formData,
  handleInputChange,
}: ProfessionalBackgroundFormProps) {
  const [errors, setErrors] = useState({
    experience: '',
    expertise: '',
    linkedIn: '',
  });

  const [touched, setTouched] = useState({
    experience: false,
    expertise: false,
    linkedIn: false,
  });

  // Validate individual fields
  const validateField = (
    field: 'experience' | 'expertise' | 'linkedIn',
    value: string
  ) => {
    let error = '';

    switch (field) {
      case 'experience':
        if (!value.trim()) {
          error = 'Business experience is required';
        } else if (value.trim().length < 50) {
          error = 'Please provide more details (minimum 50 characters)';
        }
        break;

      case 'expertise':
        if (!value.trim()) {
          error = 'Area of expertise is required';
        } else if (value.trim().length < 20) {
          error = 'Please provide more details (minimum 20 characters)';
        }
        break;

      case 'linkedIn':
        if (value.trim() && !isValidLinkedInUrl(value)) {
          error = 'Please enter a valid LinkedIn URL';
        }
        break;
    }

    return error;
  };

  // Validate LinkedIn URL
  const isValidLinkedInUrl = (url: string): boolean => {
    const linkedInPattern =
      /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[\w-]+\/?$/i;
    return linkedInPattern.test(url);
  };

  // Update errors when formData changes
  useEffect(() => {
    const newErrors = {
      experience: touched.experience
        ? validateField('experience', formData.experience || '')
        : '',
      expertise: touched.expertise
        ? validateField('expertise', formData.expertise || '')
        : '',
      linkedIn: touched.linkedIn
        ? validateField('linkedIn', formData.linkedIn || '')
        : '',
    };
    setErrors(newErrors);
  }, [formData, touched]);

  const handleBlur = (field: 'experience' | 'expertise' | 'linkedIn') => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleChange = (
    field: 'experience' | 'previousBusinesses' | 'expertise' | 'linkedIn',
    value: string
  ) => {
    handleInputChange(field as keyof FormData, value);
  };

  return (
    <div>
      <h2 className='text-2xl font-semibold text-gray-900 mb-2 font-ibm'>
        Professional Background
      </h2>
      <p className='text-gray-600 mb-8'>
        Tell us about your professional experience and expertise. Fields marked
        with * are required.
      </p>

      <div className='space-y-6'>
        <Textarea
          label='Business Experience'
          placeholder='Describe your business and entrepreneurial experience in detail. Include years of experience, industries worked in, roles held, and key achievements.'
          value={formData.experience || ''}
          onChange={e => handleChange('experience', e.target.value)}
          onBlur={() => handleBlur('experience')}
          rows={5}
          required
          error={errors.experience}
        />

        <Textarea
          label='Previous Business'
          placeholder="List any previous businesses you've started or managed. Include the business name, your role, duration, and outcomes."
          value={formData.previousBusinesses || ''}
          onChange={e => handleChange('previousBusinesses', e.target.value)}
          rows={4}
        />

        <Textarea
          label='Area of Expertise'
          placeholder='Describe your main skills and areas of expertise (e.g., Marketing, Technology, Finance, Operations, Product Development)'
          value={formData.expertise || ''}
          onChange={e => handleChange('expertise', e.target.value)}
          onBlur={() => handleBlur('expertise')}
          rows={4}
          required
          error={errors.expertise}
        />

        <Input
          type='url'
          label='LinkedIn Profile'
          placeholder='https://www.linkedin.com/in/your-profile'
          value={formData.linkedIn || ''}
          onChange={e => handleChange('linkedIn', e.target.value)}
          onBlur={() => handleBlur('linkedIn')}
          error={errors.linkedIn}
        />
      </div>

      <div className='mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg'>
        <div className='flex items-start gap-3'>
          <svg
            className='w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
            />
          </svg>
          <div>
            <h4 className='font-semibold text-purple-900 text-sm mb-1'>
              Why We Ask This
            </h4>
            <p className='text-purple-800 text-sm'>
              Your professional background helps us match you with the right
              investors and opportunities. The more detailed information you
              provide, the better we can support your startup journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
