'use client';

import { AlertTriangle, Check, Loader2, Wand2 } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import { Button } from '@/components/ui';
import {
  generateNFTImage,
  generateFallbackNFTImage,
  GeneratedImage,
} from '@/lib/aiService';

import { StartupFormData } from '../types';

interface ReviewSubmitStepProps {
  formData: StartupFormData;
  onEdit: (step: number) => void;
  onNFTGenerated?: (isGenerated: boolean) => void;
}

const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({
  formData,
  onEdit,
  onNFTGenerated,
}) => {
  const [isGeneratingNFT, setIsGeneratingNFT] = useState(false);
  const [generatedNFT, setGeneratedNFT] = useState<GeneratedImage | null>(null);
  const [nftError, setNftError] = useState<string | null>(null);

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  const handleGenerateNFT = async () => {
    setIsGeneratingNFT(true);
    setNftError(null);

    try {
      const nftImage = await generateNFTImage(formData);
      setGeneratedNFT(nftImage);
      onNFTGenerated?.(true);
    } catch (error) {
      console.error('Failed to generate NFT image:', error);
      setNftError(
        error instanceof Error ? error.message : 'Failed to generate NFT image'
      );

      // Generate fallback image
      const fallbackImage = generateFallbackNFTImage(formData);
      setGeneratedNFT({
        imageUrl: fallbackImage,
        prompt: 'Fallback SVG generated image',
        metadata: {
          object: {
            type: 'plant character',
            container: 'glass pot',
            details: {
              leaves_color: 'green',
              body_shape: 'round',
              face_expression: 'smiling',
            },
          },
          environment: {
            lighting: 'soft',
            background: { type: 'gradient', colors: ['pink', 'blue'] },
          },
          style: {
            theme: 'kawaii',
            aesthetic: ['soft', 'cute'],
            use_case: 'NFT',
            render_style: '2D',
          },
          composition: { focus: 'centered', mood: 'happy' },
          metadata: { version: '1.0', language: 'en', customizable_fields: [] },
        },
      });
      onNFTGenerated?.(true);
    } finally {
      setIsGeneratingNFT(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='mb-6'>
        <h2 className='text-2xl font-semibold font-ibm text-gray-900 mb-2'>
          Review & Submit
        </h2>
      </div>

      {/* NFT Image Section */}
      <div className='bg-white border border-gray-200 rounded-lg p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-lg font-semibold text-gray-900'>
            NFT Information
          </h3>
        </div>

        <div className='flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6'>
          {/* NFT Preview */}
          <div className='relative'>
            <div className='w-48 h-48 rounded-3xl overflow-hidden'>
              {isGeneratingNFT ? (
                <div className='w-full h-full bg-gray-300 flex items-center justify-center'>
                  <div className='text-center text-gray-600'>
                    <Loader2 className='w-8 h-8 animate-spin mx-auto mb-2' />
                    <p className='text-sm font-medium'>Generating NFT...</p>
                  </div>
                </div>
              ) : generatedNFT ? (
                <Image
                  src={generatedNFT.imageUrl}
                  alt='Generated NFT Image'
                  width={192}
                  height={192}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full bg-gray-300 flex items-center justify-center'>
                  <div className='text-center text-gray-600'>
                    <div className='w-20 h-20 bg-gray-400 rounded-full mx-auto mb-3 flex items-center justify-center'>
                      <svg
                        className='w-10 h-10 text-gray-600'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                      </svg>
                    </div>
                    <p className='text-sm font-medium text-gray-600'>
                      Generate NFT Image
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* NFT Badge */}
            {generatedNFT && (
              <div className='absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg'>
                NFT
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col space-y-3 w-full md:w-auto'>
            <Button
              onClick={handleGenerateNFT}
              disabled={isGeneratingNFT}
              className='flex items-center space-x-2'
            >
              {isGeneratingNFT ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Wand2 className='w-4 h-4' />
                  <span>Generate NFT Image</span>
                </>
              )}
            </Button>

            {nftError && (
              <div className='text-sm text-red-600 bg-red-50 p-2 rounded'>
                {nftError}
              </div>
            )}
          </div>
        </div>

        {/* NFT Details */}
        <div className='mt-6 p-4 bg-gray-50 rounded-xl'>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <span className='text-gray-600'>NFT Price:</span>
              <span className='ml-2 font-semibold text-gray-900'>
                {formData.nftPrice || '0'} ckUSDC
              </span>
            </div>
            <div>
              <span className='text-gray-600'>Total Supply:</span>
              <span className='ml-2 font-semibold text-gray-900'>100 NFTs</span>
            </div>
          </div>
        </div>

        {/* Generated NFT Details */}
        {generatedNFT && (
          <div className='mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200'>
            <h4 className='text-sm font-semibold text-blue-900 mb-3'>
              Generated NFT Details
            </h4>
            <div className='space-y-2 text-sm'>
              <div>
                <span className='text-blue-700 font-medium'>
                  Plant Character:
                </span>
                <span className='ml-2 text-blue-900'>
                  {generatedNFT.metadata.object.details.leaves_color} leaves,{' '}
                  {generatedNFT.metadata.object.details.body_shape} shape
                </span>
              </div>
              <div>
                <span className='text-blue-700 font-medium'>Expression:</span>
                <span className='ml-2 text-blue-900'>
                  {generatedNFT.metadata.object.details.face_expression}
                </span>
              </div>
              <div>
                <span className='text-blue-700 font-medium'>Container:</span>
                <span className='ml-2 text-blue-900'>
                  {generatedNFT.metadata.object.container}
                </span>
              </div>
              <div>
                <span className='text-blue-700 font-medium'>Background:</span>
                <span className='ml-2 text-blue-900'>
                  {generatedNFT.metadata.environment.background.colors.join(
                    ' and '
                  )}{' '}
                  gradient
                </span>
              </div>
              <div>
                <span className='text-blue-700 font-medium'>Style:</span>
                <span className='ml-2 text-blue-900'>
                  {generatedNFT.metadata.style.theme} theme,{' '}
                  {generatedNFT.metadata.style.aesthetic.join(', ')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Startup Information */}
      <div className='bg-white border border-gray-200 rounded-lg p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Startup information
          </h3>
          <button
            onClick={() => onEdit(1)}
            className='text-sm text-blue-600 hover:text-blue-800'
          >
            Edit
          </button>
        </div>
        <div className='grid grid-cols-2 gap-x-16 gap-y-4 text-sm'>
          <div>
            <div className='text-gray-600 text-sm mb-1'>Name</div>
            <div className='text-gray-900 font-semibold'>
              {formData.startupName || '-'}
            </div>
          </div>
          <div>
            <div className='text-gray-600 text-sm mb-1'>Sector</div>
            <div className='text-gray-900 font-semibold'>
              {formData.sector || '-'}
            </div>
          </div>
          <div>
            <div className='text-gray-600 text-sm mb-1'>Company type</div>
            <div className='text-gray-900 font-semibold'>
              {formData.companyType || '-'}
            </div>
          </div>
          <div>
            <div className='text-gray-600 text-sm mb-1'>Location</div>
            <div className='text-gray-900 font-semibold'>
              {formData.location || '-'}
            </div>
          </div>
          <div>
            <div className='text-gray-600 text-sm mb-1'>Founded Year</div>
            <div className='text-gray-900 font-semibold'>
              {formData.foundedYear || '-'}
            </div>
          </div>
          <div>
            <div className='text-gray-600 text-sm mb-1'>Website</div>
            <div className='text-gray-900 font-semibold'>
              {formData.website || '-'}
            </div>
          </div>
        </div>
      </div>

      {/* Business Model */}
      <div className='bg-white border border-gray-200 rounded-lg p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Business Model
          </h3>
          <button
            onClick={() => onEdit(2)}
            className='text-sm text-blue-600 hover:text-blue-800'
          >
            Edit
          </button>
        </div>
        <div className='space-y-4 text-sm'>
          <div>
            <span className='text-gray-600'>Problem Statement</span>
            <p className='text-gray-900 mt-1'>
              {formData.problemStatement || '-'}
            </p>
          </div>
          <div>
            <span className='text-gray-600'>Solution</span>
            <p className='text-gray-900 mt-1'>{formData.solution || '-'}</p>
          </div>
          <div>
            <span className='text-gray-600'>Target Market</span>
            <p className='text-gray-900 mt-1'>{formData.targetMarket || '-'}</p>
          </div>
          <div>
            <span className='text-gray-600'>Competitive Advantage</span>
            <p className='text-gray-900 mt-1'>
              {formData.competitiveAdvantage || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Team Information */}
      <div className='bg-white border border-gray-200 rounded-lg p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Team Information
          </h3>
          <button
            onClick={() => onEdit(3)}
            className='text-sm text-blue-600 hover:text-blue-800'
          >
            Edit
          </button>
        </div>
        <div className='space-y-6'>
          {/* Founder */}
          <div>
            <div className='grid grid-cols-2 gap-x-12 gap-y-3 text-sm'>
              <div>
                <span className='text-gray-600 text-sm'>Full name</span>
                <p className='text-gray-900 font-semibold'>
                  {formData.founderName || '-'}
                </p>
              </div>
              <div>
                <span className='text-gray-600 text-sm'>Role</span>
                <p className='text-gray-900 font-semibold'>
                  {formData.founderRole || '-'}
                </p>
              </div>
              <div>
                <span className='text-gray-600 text-sm'>Email</span>
                <p className='text-gray-900 font-semibold'>
                  {formData.founderEmail || '-'}
                </p>
              </div>
              <div>
                <span className='text-gray-600 text-sm'>LinkedIn</span>
                <p className='text-gray-900 font-semibold'>
                  {formData.founderLinkedIn || '-'}
                </p>
              </div>
            </div>
            <div className='mt-4'>
              <span className='text-gray-600 text-sm'>
                Professional background
              </span>
              <p className='text-gray-900 font-semibold text-sm mt-1'>
                {formData.founderBackground || '-'}
              </p>
            </div>
          </div>

          {/* Team Members */}
          {formData.teamMembers &&
            formData.teamMembers.map((member, index) => (
              <div key={index} className='pt-6 border-t border-gray-200'>
                <div className='grid grid-cols-2 gap-x-12 gap-y-3 text-sm'>
                  <div>
                    <span className='text-gray-600 text-sm'>Full name</span>
                    <p className='text-gray-900 font-semibold'>
                      {member.name || '-'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600 text-sm'>Role</span>
                    <p className='text-gray-900 font-semibold'>
                      {member.role || '-'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600 text-sm'>Email</span>
                    <p className='text-gray-900 font-semibold'>
                      {member.email || '-'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600 text-sm'>LinkedIn</span>
                    <p className='text-gray-900 font-semibold'>
                      {member.linkedin || '-'}
                    </p>
                  </div>
                </div>
                <div className='mt-4'>
                  <span className='text-gray-600 text-sm'>
                    Professional background
                  </span>
                  <p className='text-gray-900 font-semibold text-sm mt-1'>
                    {member.background || '-'}
                  </p>
                </div>
              </div>
            ))}

          {/* Advisors */}
          <div className='pt-6 border-t border-gray-200'>
            <span className='text-gray-600 text-sm'>Advisors</span>
            <p className='text-gray-900 font-semibold text-sm mt-1'>
              {formData.advisors || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Financial Projections & Commitment */}
      <div className='grid grid-cols-2 gap-6'>
        {/* Funding Details */}
        <div className='bg-white border border-gray-200 rounded-lg p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Funding Details
            </h3>
            <button
              onClick={() => onEdit(4)}
              className='text-sm text-blue-600 hover:text-blue-800'
            >
              Edit
            </button>
          </div>
          <div className='space-y-3 text-sm'>
            <div className='flex justify-between'>
              <span className='text-gray-600 text-sm'>Funding goal</span>
              <span className='text-gray-900 font-semibold'>
                {formData.fundingGoal
                  ? formatCurrency(formData.fundingGoal)
                  : '-'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600 text-sm'>NFT price</span>
              <span className='text-gray-900 font-semibold'>
                {formData.nftPrice ? formatCurrency(formData.nftPrice) : '-'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600 text-sm'>Total NFTs</span>
              <span className='text-gray-900 font-semibold'>100</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600 text-sm'>Monthly revenue</span>
              <span className='text-gray-900 font-semibold'>
                {formData.expectedMonthlyRevenue
                  ? formatCurrency(formData.expectedMonthlyRevenue)
                  : '-'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600 text-sm'>Monthly expenses</span>
              <span className='text-gray-900 font-semibold'>
                {formData.expectedMonthlyExpenses
                  ? formatCurrency(formData.expectedMonthlyExpenses)
                  : '-'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600 text-sm'>Break-even month</span>
              <span className='text-gray-900 font-semibold'>
                {formData.breakEvenMonth || '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Profit Sharing Commitment */}
        <div className='bg-white border border-gray-200 rounded-lg p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Profit Sharing Commitment
          </h3>
          <div className='space-y-3 text-sm'>
            <div className='flex justify-between'>
              <span className='text-gray-600 text-sm'>Monthly per NFT</span>
              <span className='text-gray-900 font-semibold'>
                {formData.monthlyProfitSharing
                  ? formatCurrency(formData.monthlyProfitSharing)
                  : '-'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600 text-sm'>Total monthly</span>
              <span className='text-gray-900 font-semibold'>
                {formData.monthlyProfitSharing && formData.nftPrice
                  ? formatCurrency(
                      parseFloat(formData.monthlyProfitSharing) * 100
                    )
                  : '-'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600 text-sm'>Annual total</span>
              <span className='text-gray-900 font-semibold'>
                {formData.monthlyProfitSharing
                  ? formatCurrency(
                      parseFloat(formData.monthlyProfitSharing) * 100 * 12
                    )
                  : '-'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600 text-sm'>3-year total</span>
              <span className='text-gray-900 font-semibold'>
                {formData.monthlyProfitSharing
                  ? formatCurrency(
                      parseFloat(formData.monthlyProfitSharing) * 100 * 12 * 3
                    )
                  : '-'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600 text-sm'>Collateral required</span>
              <span className='text-gray-900 font-semibold'>
                {formData.monthlyProfitSharing
                  ? formatCurrency(
                      parseFloat(formData.monthlyProfitSharing) * 100 * 12
                    )
                  : '-'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600 text-sm'>Investment period</span>
              <span className='text-gray-900 font-semibold'>36 months</span>
            </div>
          </div>
        </div>
      </div>

      {/* Collateral Setup & Document Status */}
      <div className='grid grid-cols-2 gap-6'>
        {/* Collateral Setup */}
        <div className='bg-white border border-gray-200 rounded-lg p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Collateral Setup
          </h3>
          <div className='space-y-3 text-sm'>
            <div className='flex justify-between'>
              <span className='text-gray-600 text-sm'>Payment method</span>
              <span className='text-gray-900 font-semibold'>ckUSDC</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600 text-sm'>Available amount</span>
              <span className='text-gray-900 font-semibold'>-</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600 text-sm'>Lock period</span>
              <span className='text-gray-900 font-semibold'>36 months</span>
            </div>
          </div>
        </div>

        {/* Document Status */}
        <div className='bg-white border border-gray-200 rounded-lg p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Document Status
            </h3>
            <button
              onClick={() => onEdit(5)}
              className='text-sm text-blue-600 hover:text-blue-800'
            >
              Edit
            </button>
          </div>
          <div className='space-y-3 text-sm'>
            <div className='flex items-center space-x-2'>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  formData.businessPlanUrl ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                {formData.businessPlanUrl && (
                  <Check className='w-3 h-3 text-white' />
                )}
              </div>
              <span className='text-gray-900 font-semibold'>Business Plan</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  formData.financialProjectionsUrl
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              >
                {formData.financialProjectionsUrl && (
                  <Check className='w-3 h-3 text-white' />
                )}
              </div>
              <span className='text-gray-900 font-semibold'>
                Financial Projections
              </span>
            </div>
            <div className='flex items-center space-x-2'>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  formData.legalDocumentsUrl ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                {formData.legalDocumentsUrl && (
                  <Check className='w-3 h-3 text-white' />
                )}
              </div>
              <span className='text-gray-900 font-semibold'>
                Legal Documents
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Before Submission */}
      <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
        <div className='flex'>
          <div className='flex-shrink-0'>
            <AlertTriangle className='h-5 w-5 text-yellow-400' />
          </div>
          <div className='ml-3'>
            <h3 className='text-sm font-medium text-yellow-800'>
              Before submission
            </h3>
            <div className='mt-2 text-sm text-yellow-700'>
              <ul className='list-disc list-inside space-y-1'>
                <li>Review all information for accuracy</li>
                <li>Ensure you have sufficient ckUSDC/ICP for collateral</li>
                <li>Understand 36-month commitment requirement</li>
                <li>Platform review may take 5-7 business days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmitStep;
