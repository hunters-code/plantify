'use client';

import { AlertTriangle, Loader2, X } from 'lucide-react';
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
        const fileUrl = await uploadFile(
          file,
          'plantify-uploads',
          'financialProjections'
        );

        if (fileUrl) {
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
        const fileUrl = await uploadFile(
          file,
          'plantify-uploads',
          'legalDocuments'
        );

        if (fileUrl) {
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

  const handleRemoveBusinessPlan = () => {
    setFormData('businessPlan', null);
    setFormData('businessPlanUrl', '');
  };

  const handleRemoveFinancialProjections = () => {
    setFormData('financialProjectionsFile', null);
    setFormData('financialProjectionsUrl', '');
  };

  const handleRemoveLegalDocuments = () => {
    setFormData('legalDocuments', null);
    setFormData('legalDocumentsUrl', '');
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
          <div className='space-y-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Business plan <span className='text-red-500'>*</span>
            </label>

            {isUploadingBusinessPlan && (
              <div className='flex items-center space-x-2 text-blue-600 mb-4'>
                <Loader2 size={16} className='animate-spin' />
                <span className='text-sm'>Uploading business plan...</span>
              </div>
            )}

            {formData.businessPlanUrl && !isUploadingBusinessPlan ? (
              <div className='mb-4'>
                <p className='text-sm font-medium text-gray-700 mb-3'>
                  Business Plan Preview:
                </p>
                <div className='relative inline-block'>
                  <div className='flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm'>
                    <div className='p-2 bg-blue-100 rounded-md'>
                      <svg
                        className='w-6 h-6 text-blue-600'
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
                    <div className='flex-1'>
                      <div className='text-sm font-medium text-gray-900'>
                        {formData.businessPlan?.name}
                      </div>
                      <div className='text-xs text-green-600 flex items-center mt-1'>
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
                  <button
                    type='button'
                    onClick={handleRemoveBusinessPlan}
                    className='absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors duration-200'
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              !isUploadingBusinessPlan && (
                <FileUpload
                  accept='.pdf'
                  maxSize='10MB'
                  fileTypes='pdf'
                  onFileSelect={handleBusinessPlanUpload}
                  disabled={isUploadingBusinessPlan}
                />
              )
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
          <div className='space-y-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Financial projections <span className='text-red-500'>*</span>
            </label>

            {isUploadingFinancialProjections && (
              <div className='flex items-center space-x-2 text-blue-600 mb-4'>
                <Loader2 size={16} className='animate-spin' />
                <span className='text-sm'>
                  Uploading financial projections...
                </span>
              </div>
            )}

            {formData.financialProjectionsUrl &&
            !isUploadingFinancialProjections ? (
              <div className='mb-4'>
                <p className='text-sm font-medium text-gray-700 mb-3'>
                  Financial Projections Preview:
                </p>
                <div className='relative inline-block'>
                  <div className='flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-100 shadow-sm'>
                    <div className='p-2 bg-green-100 rounded-md'>
                      <svg
                        className='w-6 h-6 text-green-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                        />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <div className='text-sm font-medium text-gray-900'>
                        {formData.financialProjectionsFile?.name}
                      </div>
                      <div className='text-xs text-green-600 flex items-center mt-1'>
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
                  <button
                    type='button'
                    onClick={handleRemoveFinancialProjections}
                    className='absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors duration-200'
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              !isUploadingFinancialProjections && (
                <FileUpload
                  accept='.csv,.pdf'
                  maxSize='10MB'
                  fileTypes='csv or pdf'
                  onFileSelect={handleFinancialProjectionsUpload}
                  disabled={isUploadingFinancialProjections}
                />
              )
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
          <div className='space-y-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Legal documents <span className='text-red-500'>*</span>
            </label>

            {isUploadingLegalDocuments && (
              <div className='flex items-center space-x-2 text-blue-600 mb-4'>
                <Loader2 size={16} className='animate-spin' />
                <span className='text-sm'>Uploading legal documents...</span>
              </div>
            )}

            {formData.legalDocumentsUrl && !isUploadingLegalDocuments ? (
              <div className='mb-4'>
                <p className='text-sm font-medium text-gray-700 mb-3'>
                  Legal Documents Preview:
                </p>
                <div className='relative inline-block'>
                  <div className='flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-100 shadow-sm'>
                    <div className='p-2 bg-purple-100 rounded-md'>
                      <svg
                        className='w-6 h-6 text-purple-600'
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
                    <div className='flex-1'>
                      <div className='text-sm font-medium text-gray-900'>
                        {formData.legalDocuments?.name}
                      </div>
                      <div className='text-xs text-green-600 flex items-center mt-1'>
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
                  <button
                    type='button'
                    onClick={handleRemoveLegalDocuments}
                    className='absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors duration-200'
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              !isUploadingLegalDocuments && (
                <FileUpload
                  accept='.zip'
                  maxSize='10MB'
                  fileTypes='zip'
                  onFileSelect={handleLegalDocumentsUpload}
                  disabled={isUploadingLegalDocuments}
                />
              )
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
