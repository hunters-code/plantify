'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

import FileUpload from '@/components/ui/FileUpload';
import { uploadFile } from '@/lib/fileUpload';

import { StartupFormData } from '../types';

interface CollateralSetupStepProps {
  formData: StartupFormData;
  setFormData: (
    field: string,
    value: string | File | null,
    shouldValidate?: boolean
  ) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

const CollateralSetupStep: React.FC<CollateralSetupStepProps> = ({
  formData,
  setFormData,
  errors = {},
  touched = {},
}) => {
  const [isUploadingBusinessPlan, setIsUploadingBusinessPlan] = useState(false);
  const [isUploadingFinancialProjections, setIsUploadingFinancialProjections] =
    useState(false);
  const [isUploadingLegalDocuments, setIsUploadingLegalDocuments] =
    useState(false);

  const handleBusinessPlanUpload = async (files: File[]) => {
    if (files && files.length > 0) {
      const file = files[0];

      setFormData('businessPlan', file);

      setIsUploadingBusinessPlan(true);
      try {
        const fileUrl = await uploadFile(
          file,
          'plantify-uploads',
          'businessPlan'
        );

        if (fileUrl) {
          setFormData('businessPlanUrl', fileUrl);
        }
      } catch (error) {
        console.error('Error uploading business plan:', error);
      } finally {
        setIsUploadingBusinessPlan(false);
      }
    }
  };

  const handleFinancialProjectionsUpload = async (files: File[]) => {
    if (files && files.length > 0) {
      const file = files[0];

      // Set the file in form data
      setFormData('financialProjectionsFile', file);

      // Upload the file and get the preview URL
      setIsUploadingFinancialProjections(true);
      try {
        console.log('Uploading financial projections for preview...');
        const fileUrl = await uploadFile(
          file,
          'plantify-uploads',
          'financialProjections'
        );

        if (fileUrl) {
          console.log('Financial projections uploaded successfully:', fileUrl);

          // Store the URL in the form data
          setFormData('financialProjectionsUrl', fileUrl);
        } else {
          console.error('Failed to upload financial projections');
        }
      } catch (error) {
        console.error('Error uploading financial projections:', error);
      } finally {
        setIsUploadingFinancialProjections(false);
      }
    }
  };

  const handleLegalDocumentsUpload = async (files: File[]) => {
    if (files && files.length > 0) {
      const file = files[0];

      // Set the file in form data
      setFormData('legalDocuments', file);

      // Upload the file and get the preview URL
      setIsUploadingLegalDocuments(true);
      try {
        console.log('Uploading legal documents for preview...');
        const fileUrl = await uploadFile(
          file,
          'plantify-uploads',
          'legalDocuments'
        );

        if (fileUrl) {
          console.log('Legal documents uploaded successfully:', fileUrl);

          // Store the URL in the form data
          setFormData('legalDocumentsUrl', fileUrl);
        } else {
          console.error('Failed to upload legal documents');
        }
      } catch (error) {
        console.error('Error uploading legal documents:', error);
      } finally {
        setIsUploadingLegalDocuments(false);
      }
    }
  };

  return (
    <div className='space-y-6'>
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold font-ibm text-gray-900 mb-2'>
          Required Documentation
        </h2>
      </div>

      <div className='space-y-8'>
        {/* Business Plan */}
        <div>
          <div className='space-y-2'>
            <FileUpload
              label='Business plan'
              accept='.pdf'
              maxSize='10MB'
              fileTypes='pdf'
              onFileSelect={handleBusinessPlanUpload}
              disabled={isUploadingBusinessPlan}
            />

            {isUploadingBusinessPlan && (
              <div className='flex items-center space-x-2 text-blue-600 mt-2'>
                <Loader2 size={16} className='animate-spin' />
                <span className='text-sm'>Uploading business plan...</span>
              </div>
            )}

            {formData.businessPlanUrl && !isUploadingBusinessPlan && (
              <div className='mt-2 flex items-center space-x-2'>
                <div className='p-2 bg-blue-50 rounded-md border border-blue-100'>
                  <svg
                    className='w-6 h-6 text-blue-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    />
                  </svg>
                </div>
                <div>
                  <div className='text-sm font-medium'>
                    {formData.businessPlan?.name}
                  </div>
                  <div className='text-xs text-green-600 flex items-center'>
                    <svg
                      className='w-3 h-3 mr-1'
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

          <div className='mt-2 text-sm text-gray-600'>
            <p className='font-medium'>Must include:</p>
            <p>
              Executive summary, market analysis, competitive landscape,
              marketing strategy, operational plan, team information, and
              financial projections
            </p>
          </div>
        </div>

        {/* Financial Projections */}
        <div>
          <div className='space-y-2'>
            <FileUpload
              label='Financial projections'
              accept='.csv,.pdf'
              maxSize='10MB'
              fileTypes='csv or pdf'
              onFileSelect={handleFinancialProjectionsUpload}
              disabled={isUploadingFinancialProjections}
            />

            {isUploadingFinancialProjections && (
              <div className='flex items-center space-x-2 text-blue-600 mt-2'>
                <Loader2 size={16} className='animate-spin' />
                <span className='text-sm'>
                  Uploading financial projections...
                </span>
              </div>
            )}

            {formData.financialProjectionsUrl &&
              !isUploadingFinancialProjections && (
                <div className='mt-2 flex items-center space-x-2'>
                  <div className='p-2 bg-blue-50 rounded-md border border-blue-100'>
                    <svg
                      className='w-6 h-6 text-blue-500'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      />
                    </svg>
                  </div>
                  <div>
                    <div className='text-sm font-medium'>
                      {formData.financialProjectionsFile?.name}
                    </div>
                    <div className='text-xs text-green-600 flex items-center'>
                      <svg
                        className='w-3 h-3 mr-1'
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

          <div className='mt-2 text-sm text-gray-600'>
            <p className='font-medium'>
              36-month monthly projections in ckUSDC including:
            </p>
            <p>
              Revenue, expenses, cash flow, break-even analysis, and profit
              sharing commitments
            </p>
          </div>
        </div>

        {/* Legal Documents */}
        <div>
          <div className='space-y-2'>
            <FileUpload
              label='Legal documents'
              accept='.zip'
              maxSize='10MB'
              fileTypes='zip'
              onFileSelect={handleLegalDocumentsUpload}
              disabled={isUploadingLegalDocuments}
            />

            {isUploadingLegalDocuments && (
              <div className='flex items-center space-x-2 text-blue-600 mt-2'>
                <Loader2 size={16} className='animate-spin' />
                <span className='text-sm'>Uploading legal documents...</span>
              </div>
            )}

            {formData.legalDocumentsUrl && !isUploadingLegalDocuments && (
              <div className='mt-2 flex items-center space-x-2'>
                <div className='p-2 bg-blue-50 rounded-md border border-blue-100'>
                  <svg
                    className='w-6 h-6 text-blue-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
                    />
                  </svg>
                </div>
                <div>
                  <div className='text-sm font-medium'>
                    {formData.legalDocuments?.name}
                  </div>
                  <div className='text-xs text-green-600 flex items-center'>
                    <svg
                      className='w-3 h-3 mr-1'
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

          <div className='mt-2 text-sm text-gray-600'>
            <p className='font-medium'>
              Articles of incorporation, business license, tax ID, founder ID
            </p>
          </div>
        </div>
      </div>

      {/* Information Box */}
      <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8'>
        <div className='flex'>
          <div className='flex-shrink-0'>
            <AlertTriangle className='h-5 w-5 text-yellow-400' />
          </div>
          <div className='ml-3'>
            <h3 className='text-sm font-medium text-yellow-800'>
              Document Requirements
            </h3>
            <div className='mt-2 text-sm text-yellow-700'>
              <ul className='list-disc list-inside space-y-1'>
                <li>
                  Ensure all documents are in English or provide certified
                  translations
                </li>
                <li>
                  Financial projections must be realistic and well-researched
                </li>
                <li>
                  Business plan should be comprehensive and professionally
                  written
                </li>
                <li>All legal documents must be current and valid</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollateralSetupStep;
