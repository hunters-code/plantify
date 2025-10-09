'use client';

import { Loader2 } from 'lucide-react';
import React, { ChangeEvent, useState } from 'react';

import FileUpload from '@/components/ui/FileUpload';
import { STARTUP_SECTOR_OPTIONS } from '@/constants/startupSectors';
import { uploadFile } from '@/lib/fileUpload';

import { StartupFormData } from '../types';

interface BasicInformationStepProps {
  formData: StartupFormData;
  setFormData: (
    field: string,
    value: string | File | null,
    shouldValidate?: boolean
  ) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

const BasicInformationStep: React.FC<BasicInformationStepProps> = ({
  formData,
  setFormData,
  errors = {},
  touched = {},
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(name, value);
  };

  const handleLogoUpload = async (files: File[]) => {
    if (files && files.length > 0) {
      const file = files[0];

      setFormData('logo', file);
      setIsUploading(true);
      try {
        const fileUrl = await uploadFile(file, 'plantify-uploads', 'logo');

        if (fileUrl) {
          setLogoPreviewUrl(fileUrl);

          setFormData('logoUrl', fileUrl);
        } else {
          console.error('Failed to upload logo');
        }
      } catch (error) {
        console.error('Error uploading logo:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const inputStyle =
    'w-full flex items-center gap-[6px] px-4 py-3 rounded-[12px] border border-[#E5E5E5] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.16)] text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-[16px]';

  return (
    <div className='space-y-6'>
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold font-ibm text-gray-900 mb-2'>
          Basic Information
        </h2>
      </div>

      <div className='space-y-6'>
        {/* Startup Name */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Startup Name <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='startupName'
            value={formData.startupName || ''}
            onChange={handleChange}
            placeholder='Enter your startup name here'
            className={`${inputStyle} ${errors.startupName ? 'border-red-500' : ''}`}
            required
          />
          {errors.startupName && (
            <p className='mt-1 text-sm text-red-600'>{errors.startupName}</p>
          )}
        </div>

        {/* Startup Logo */}
        <div className='space-y-2'>
          <FileUpload
            label='Startup Logo'
            accept='.jpg,.png,.pdf'
            maxSize='2MB'
            fileTypes='jpg, png, or pdf'
            onFileSelect={handleLogoUpload}
            disabled={isUploading}
          />

          {isUploading && (
            <div className='flex items-center space-x-2 text-blue-600 mt-2'>
              <Loader2 size={16} className='animate-spin' />
              <span className='text-sm'>Uploading logo...</span>
            </div>
          )}

          {logoPreviewUrl && !isUploading && (
            <div className='mt-2'>
              <p className='text-sm font-medium text-gray-700 mb-1'>Preview:</p>
              <div className='flex items-center space-x-2'>
                <div className='h-16 w-16 rounded-md overflow-hidden border border-gray-200'>
                  <img
                    src={logoPreviewUrl}
                    alt='Logo Preview'
                    className='h-full w-full object-cover'
                  />
                </div>
                <div className='text-sm text-green-600 flex items-center'>
                  <svg
                    className='w-4 h-4 mr-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  Uploaded successfully
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Business Sector and Founded Year */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Business sector <span className='text-red-500'>*</span>
            </label>
            <select
              name='sector'
              value={formData.sector || ''}
              onChange={handleChange}
              className={`${inputStyle} ${errors.sector ? 'border-red-500' : ''}`}
              required
            >
              <option value=''>Select sector</option>
              {STARTUP_SECTOR_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.sector && touched.sector && (
              <p className='mt-1 text-sm text-red-600'>{errors.sector}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Founded Year <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              name='foundedYear'
              value={formData.foundedYear || ''}
              onChange={handleChange}
              placeholder='Enter your startup founded year here'
              className={`${inputStyle} ${errors.foundedYear ? 'border-red-500' : ''}`}
              required
            />
            {errors.foundedYear && touched.foundedYear && (
              <p className='mt-1 text-sm text-red-600'>{errors.foundedYear}</p>
            )}
          </div>
        </div>

        {/* Company Type and Location */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Company type <span className='text-red-500'>*</span>
            </label>
            <select
              name='companyType'
              value={formData.companyType || ''}
              onChange={handleChange}
              className={`${inputStyle} ${errors.companyType ? 'border-red-500' : ''}`}
              required
            >
              <option value=''>Select company type</option>
              <option value='corporation'>Corporation</option>
              <option value='llc'>LLC</option>
              <option value='partnership'>Partnership</option>
              <option value='sole_proprietorship'>Sole Proprietorship</option>
              <option value='other'>Other</option>
            </select>
            {errors.companyType && touched.companyType && (
              <p className='mt-1 text-sm text-red-600'>{errors.companyType}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Location <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              name='location'
              value={formData.location || ''}
              onChange={handleChange}
              placeholder='City, Country'
              className={`${inputStyle} ${errors.location ? 'border-red-500' : ''}`}
              required
            />
            {errors.location && touched.location && (
              <p className='mt-1 text-sm text-red-600'>{errors.location}</p>
            )}
          </div>
        </div>

        {/* Business Description */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Business description <span className='text-red-500'>*</span>
          </label>
          <textarea
            name='description'
            value={formData.description || ''}
            onChange={handleChange}
            rows={4}
            placeholder='Describe your business in 2-3 sentences'
            className={`${inputStyle} resize-none ${errors.description ? 'border-red-500' : ''}`}
            required
          />
          {errors.description && touched.description && (
            <p className='mt-1 text-sm text-red-600'>{errors.description}</p>
          )}
        </div>

        {/* Website URL */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Website URL
          </label>
          <input
            type='url'
            name='website'
            value={formData.website || ''}
            onChange={handleChange}
            placeholder='https://your-startup.com'
            className={inputStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformationStep;
