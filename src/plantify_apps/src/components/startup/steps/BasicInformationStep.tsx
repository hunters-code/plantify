'use client';

import { Loader2, X } from 'lucide-react';
import Image from 'next/image';
import React, { ChangeEvent, useState } from 'react';

import FileUpload from '@/components/ui/FileUpload';
import { COMPANY_TYPE_OPTIONS } from '@/constants/companyTypes';
import { STARTUP_SECTOR_OPTIONS } from '@/constants/startupSectors';
import { uploadFile } from '@/lib/fileUpload';

import { StartupFormData } from '../types';

interface BasicInformationStepProps {
  formData: StartupFormData;
  setFormData: (
    field: string,
    value: string | File | null | boolean | File[] | string[],
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
  const [isUploadingCompanyImages, setIsUploadingCompanyImages] =
    useState(false);

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

  const handleRemoveLogo = () => {
    setFormData('logo', null);
    setFormData('logoUrl', '');
  };

  const handleCompanyImagesUpload = async (files: File[]) => {
    if (files && files.length > 0) {
      setIsUploadingCompanyImages(true);

      try {
        const currentImages = formData.companyImages || [];
        const currentUrls = formData.companyImagesUrls || [];

        // Upload all selected files
        const uploadPromises = files.map(file =>
          uploadFile(file, 'plantify-uploads', 'companyImage')
        );

        const uploadedUrls = await Promise.all(uploadPromises);
        const successfulUrls = uploadedUrls.filter(
          url => url !== null
        ) as string[];

        if (successfulUrls.length > 0) {
          // Add new files to existing ones
          const updatedImages = [...currentImages, ...files];
          const updatedUrls = [...currentUrls, ...successfulUrls];

          setFormData('companyImages', updatedImages);
          setFormData('companyImagesUrls', updatedUrls);
        } else {
          console.error('Failed to upload company images');
        }
      } catch (error) {
        console.error('Error uploading company images:', error);
      } finally {
        setIsUploadingCompanyImages(false);
      }
    }
  };

  const handleRemoveCompanyImage = (index: number) => {
    const currentImages = formData.companyImages || [];
    const currentUrls = formData.companyImagesUrls || [];

    // Remove image and URL at the specified index
    const updatedImages = currentImages.filter((_, i) => i !== index);
    const updatedUrls = currentUrls.filter((_, i) => i !== index);

    setFormData('companyImages', updatedImages);
    setFormData('companyImagesUrls', updatedUrls);
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
        <div className='space-y-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Startup Logo <span className='text-red-500'>*</span>
          </label>

          {isUploading && (
            <div className='flex items-center space-x-2 text-blue-600 mb-4'>
              <Loader2 size={16} className='animate-spin' />
              <span className='text-sm'>Uploading logo...</span>
            </div>
          )}

          {formData.logoUrl && !isUploading ? (
            <div className='mb-4'>
              <p className='text-sm font-medium text-gray-700 mb-2'>
                Logo Preview:
              </p>
              <div className='relative inline-block'>
                <div className='h-32 w-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white p-2'>
                  <Image
                    src={formData.logoUrl}
                    alt='Startup Logo Preview'
                    width={112}
                    height={112}
                    className='h-full w-full object-contain'
                  />
                </div>
                <button
                  type='button'
                  onClick={handleRemoveLogo}
                  className='absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors duration-200'
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            !isUploading && (
              <FileUpload
                accept='.jpg,.png,.pdf'
                maxSize='2MB'
                fileTypes='jpg, png, or pdf'
                onFileSelect={handleLogoUpload}
                disabled={isUploading}
              />
            )
          )}
        </div>

        {/* Company Images */}
        <div className='space-y-4 border-t border-gray-200 pt-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Company Images
          </label>
          <p className='text-sm text-gray-500 mb-4'>
            Upload images that showcase your company, products, team, or office
            space. You can upload multiple images.
          </p>

          {isUploadingCompanyImages && (
            <div className='flex items-center space-x-2 text-blue-600 mb-4'>
              <Loader2 size={16} className='animate-spin' />
              <span className='text-sm'>Uploading company images...</span>
            </div>
          )}

          {/* Display uploaded company images */}
          {formData.companyImagesUrls &&
            formData.companyImagesUrls.length > 0 && (
              <div className='mb-4'>
                <p className='text-sm font-medium text-gray-700 mb-3'>
                  Company Images Preview:
                </p>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                  {formData.companyImagesUrls.map((imageUrl, index) => (
                    <div key={index} className='relative group'>
                      <div className='h-32 w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm'>
                        <Image
                          src={imageUrl}
                          alt={`Company Image ${index + 1}`}
                          width={128}
                          height={128}
                          className='h-full w-full object-cover'
                        />
                      </div>
                      <button
                        type='button'
                        onClick={() => handleRemoveCompanyImage(index)}
                        className='absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors duration-200 opacity-0 group-hover:opacity-100'
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Upload area for company images */}
          <div>
            <FileUpload
              accept='.jpg,.png,.jpeg'
              maxSize='5MB'
              fileTypes='jpg, png, or jpeg'
              onFileSelect={handleCompanyImagesUpload}
              disabled={isUploadingCompanyImages}
            />
          </div>
        </div>

        {/* Built by Caffeine.AI Toggle */}
        <div className='border border-purple-200 bg-purple-50 rounded-lg p-4'>
          <div className='flex items-center space-x-2'>
            <input
              type='checkbox'
              id='builtByCaffeineAI'
              name='builtByCaffeineAI'
              checked={formData.builtByCaffeineAI || false}
              onChange={e => setFormData('builtByCaffeineAI', e.target.checked)}
              className='h-5 w-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500'
            />
            <label
              htmlFor='builtByCaffeineAI'
              className='text-sm font-semibold text-purple-700'
            >
              Built by Caffeine.AI
            </label>
          </div>
          <p className='mt-2 text-xs text-purple-600 pl-7'>
            Check this if your startup was built with the help of Caffeine.AI.
            Startups built by Caffeine.AI will be highlighted with a special
            badge on the explore page.
          </p>
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
              {COMPANY_TYPE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
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
