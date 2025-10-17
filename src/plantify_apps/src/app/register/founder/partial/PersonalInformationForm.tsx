import { useState, useEffect, useCallback, ChangeEvent } from 'react';

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

interface PersonalInformationFormProps {
  formData: Pick<FormData, 'fullName' | 'email' | 'phone' | 'address'>;
  handleInputChange: <
    K extends keyof Pick<FormData, 'fullName' | 'email' | 'phone' | 'address'>,
  >(
    field: K,
    value: string
  ) => void;
}

export default function PersonalInformationForm({
  formData,
  handleInputChange,
}: PersonalInformationFormProps) {
  const [errors, setErrors] = useState<Record<keyof typeof formData, string>>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  const [touched, setTouched] = useState<
    Record<keyof typeof formData, boolean>
  >({
    fullName: false,
    email: false,
    phone: false,
    address: false,
  });

  const validateField = useCallback(
    (field: keyof typeof formData, value: string): string => {
      let error = '';

      switch (field) {
        case 'fullName':
          if (!value.trim()) error = 'Full name is required';
          else if (value.trim().length < 3)
            error = 'Full name must be at least 3 characters';
          else if (!/^[a-zA-Z\s]+$/.test(value))
            error = 'Full name can only contain letters and spaces';
          break;

        case 'email':
          if (!value.trim()) error = 'Email is required';
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            error = 'Please enter a valid email address';
          break;

        case 'phone':
          if (!value.trim()) error = 'Phone number is required';
          else if (!/^[\d+\-\s()]+$/.test(value))
            error = 'Please enter a valid phone number';
          else if (value.replace(/\D/g, '').length < 10)
            error = 'Phone number must be at least 10 digits';
          break;

        case 'address':
          if (!value.trim()) error = 'Address is required';
          else if (value.trim().length < 10)
            error = 'Please provide a complete address (minimum 10 characters)';
          break;
      }

      return error;
    },
    []
  );

  useEffect(() => {
    const newErrors: Record<keyof typeof formData, string> = {
      fullName: touched.fullName
        ? validateField('fullName', formData.fullName)
        : '',
      email: touched.email ? validateField('email', formData.email) : '',
      phone: touched.phone ? validateField('phone', formData.phone) : '',
      address: touched.address
        ? validateField('address', formData.address)
        : '',
    };
    setErrors(newErrors);
  }, [formData, touched, validateField]);

  const handleBlur = (field: keyof typeof formData): void => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleChange = (
    field: keyof typeof formData,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    handleInputChange(field, event.target.value);
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
          onChange={e => handleChange('fullName', e)}
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
            onChange={e => handleChange('email', e)}
            onBlur={() => handleBlur('email')}
            required
            error={errors.email}
          />
          <Input
            type='tel'
            label='Phone number'
            placeholder='+62 812 3456 7890'
            value={formData.phone}
            onChange={e => handleChange('phone', e)}
            onBlur={() => handleBlur('phone')}
            required
            error={errors.phone}
          />
        </div>

        <Textarea
          label='Complete address'
          placeholder='Street address, city, province, postal code, country'
          value={formData.address}
          onChange={e => handleChange('address', e)}
          onBlur={() => handleBlur('address')}
          rows={4}
          required
          error={errors.address}
        />
      </div>
    </div>
  );
}
