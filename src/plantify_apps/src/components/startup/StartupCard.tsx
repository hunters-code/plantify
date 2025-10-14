'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import {
  LikeIcon,
  LocationIcon,
  CoinsIcon,
  TrendingUpIcon,
  PercentIcon,
  PackageIcon,
  TargetIcon,
  EyeIcon,
  InvestIcon,
} from '@/components/icons';
import Button from '@/components/ui/Button';

export interface StartupCardProps {
  id: string | number;
  image: string;
  title: string;
  description?: string;
  category?: string;
  riskLevel?: string;
  location?: string;
  employees?: string;
  logo?: string;
  nftPrice: string;
  periodicReturn: string;
  annualROI?: string;
  availability?: string;
  fundedText: string;
  fundedPct?: number;
  fundedColor?: string;
  totalFunded?: number;
  fundingGoal?: number;
  builtByCaffeineAI?: boolean;
  onViewDetails?: (id: string | number) => void;
  onInvest?: (id: string | number) => void;
  showLikeButton?: boolean;
  showLocation?: boolean;
  showDescription?: boolean;
  showAnnualROI?: boolean;
  showAvailability?: boolean;
}

export function StartupCard({
  id,
  image,
  title,
  description,
  category,
  riskLevel,
  location,
  employees,
  logo,
  nftPrice,
  periodicReturn,
  annualROI,
  availability,
  fundedText,
  fundedPct = 0.45,
  fundedColor = '#22c55e',
  totalFunded,
  fundingGoal,
  builtByCaffeineAI = false,
  onViewDetails,
  onInvest,
  showLikeButton = true,
  showLocation = true,
  showDescription = true,
  showAnnualROI = true,
  showAvailability = true,
}: StartupCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = React.useState(false);

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(id);
    } else {
      router.push(`/explore/detail?id=${id}`);
    }
  };

  const handleInvest = () => {
    if (onInvest) {
      onInvest(id);
    } else {
      router.push(`/explore/detail?id=${id}&action=invest`);
    }
  };

  return (
    <div className='bg-white border border-neutral-200 rounded-[16px] overflow-hidden hover:shadow-lg transition-shadow'>
      {/* Image Section with Overlay */}
      <div className='relative h-[280px] overflow-hidden rounded-[12px] m-2'>
        {imageError ? (
          <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
            <div className='text-center text-gray-500'>
              <div className='w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center'>
                <span className='text-gray-500 text-sm'>No Image</span>
              </div>
            </div>
          </div>
        ) : (
          <Image
            src={image}
            alt={title}
            fill
            className='object-cover'
            onError={() => setImageError(true)}
          />
        )}

        {/* Overlay Info */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
        <div className='absolute top-2 right-2 flex gap-2'>
          {showLikeButton && (
            <button className='bg-[#f4f3ff] border border-[#d9d6fe] rounded-[6px] p-[3px] hover:bg-[#e9e7ff] transition-colors'>
              <LikeIcon className='w-[18px] h-[18px] text-[#5925dc]' />
            </button>
          )}
          {category && (
            <span className='bg-[#f4f3ff] border border-[#d9d6fe] text-[#5925dc] px-2 py-[2px] rounded-[8px] text-[14px] font-normal tracking-[-0.14px]'>
              {category}
            </span>
          )}
          {riskLevel && (
            <span className='bg-[#fefbe8] border border-[#feee95] text-[#a15c07] px-2 py-[2px] rounded-[8px] text-[14px] font-normal tracking-[-0.14px]'>
              {riskLevel}
            </span>
          )}
        </div>

        {/* Caffeine.AI Label */}
        {builtByCaffeineAI && (
          <div className='absolute bottom-12 left-2 right-2'>
            <div
              className='inline-block px-2 py-[2px] rounded-[8px] text-[14px] font-normal tracking-[-0.14px]'
              style={{
                backgroundColor: '#DDF730',
                color: '#1D1D1D',
                border: '1px solid #DDF730',
              }}
            >
              <span className='font-normal'>built with </span>
              <span
                style={{
                  fontFamily: '"Test Söhne Breit", sans-serif',
                  fontWeight: 600,
                }}
              >
                caffeine.ai
              </span>
            </div>
          </div>
        )}

        {/* Location Info */}
        {showLocation && (location || employees) && (
          <div className='absolute bottom-2 left-2 right-2'>
            <div className='bg-neutral-50 border border-[#e9eaeb] rounded-[8px] pl-1 pr-2 py-[2px] flex items-center gap-1'>
              <LocationIcon className='w-[18px] h-[18px] text-[#414651]' />
              <span className='text-[14px] text-[#414651] font-normal leading-[1.4] tracking-[-0.14px]'>
                {location && employees
                  ? `${location} • ${employees}`
                  : location || employees}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className='px-3 pt-1 pb-3 space-y-4'>
        {/* Startup Header */}
        <div className='flex items-start gap-[6px]'>
          {logo && (
            <div className='w-5 h-5 rounded overflow-hidden flex-shrink-0 mt-1'>
              <Image
                src={logo}
                alt={`${title} logo`}
                width={20}
                height={20}
                className='object-cover'
              />
            </div>
          )}
          <div className='flex-1 min-w-0'>
            <h3 className='font-ibm text-[20px] font-normal text-neutral-950 leading-[1.4] tracking-[-0.2px]'>
              {title}
            </h3>
            {showDescription && description && (
              <p className='text-[14px] text-neutral-500 font-normal leading-[1.4] tracking-[-0.14px] mt-1 line-clamp-2 pl-[26px]'>
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Investment Details */}
        <div className='space-y-1'>
          <div className='flex items-start gap-[6px]'>
            <div className='flex items-center pt-px'>
              <CoinsIcon className='w-[18px] h-[18px] text-neutral-950' />
            </div>
            <span className='text-[14px] text-neutral-950 font-normal leading-[1.4] tracking-[-0.14px]'>
              NFT Price: <span className='font-medium'>{nftPrice}</span>
            </span>
          </div>

          <div className='flex items-start gap-[6px]'>
            <div className='flex items-center pt-px'>
              <TrendingUpIcon className='w-[18px] h-[18px] text-neutral-950' />
            </div>
            <span className='text-[14px] text-neutral-950 font-normal leading-[1.4] tracking-[-0.14px]'>
              Periodic Returns:{' '}
              <span className='font-medium'>{periodicReturn}</span>
            </span>
          </div>

          {showAnnualROI && annualROI && (
            <div className='flex items-start gap-[6px]'>
              <div className='flex items-center pt-px'>
                <PercentIcon className='w-[18px] h-[18px] text-neutral-950' />
              </div>
              <span className='text-[14px] text-neutral-950 font-normal leading-[1.4] tracking-[-0.14px]'>
                Annual ROI: <span className='font-medium'>{annualROI} %</span>
              </span>
            </div>
          )}

          {showAvailability && availability && (
            <div className='flex items-start gap-[6px]'>
              <div className='flex items-center pt-px'>
                <PackageIcon className='w-[18px] h-[18px] text-neutral-950' />
              </div>
              <span className='text-[14px] text-neutral-950 font-normal leading-[1.4] tracking-[-0.14px]'>
                Available: <span className='font-medium'>{availability}</span>
              </span>
            </div>
          )}
        </div>

        {/* Funding Progress */}
        <div className='space-y-[6px]'>
          <div className='flex items-start gap-[6px]'>
            <div className='flex items-center pt-px'>
              <TargetIcon className='w-[18px] h-[18px] text-neutral-950' />
            </div>
            <span className='text-[14px] text-neutral-950 font-normal leading-[1.4] tracking-[-0.14px]'>
              Funding Progress:{' '}
              <span className='font-medium text-[#b54708]'>{fundedText}</span>
            </span>
          </div>

          <div className='pl-6'>
            <div className='w-full bg-neutral-100 rounded-full h-[8px]'>
              <div
                className='h-[8px] rounded-full bg-[#fe9900]'
                style={{
                  width: `${Math.min(100, Math.max(0, (fundedPct || 0) * 100))}%`,
                }}
              />
            </div>
            <div className='flex justify-between text-[14px] font-medium mt-1'>
              <span className='text-[#b54708]'>
                ${totalFunded?.toLocaleString() || '0'}
              </span>
              <span className='text-[#a1a1a1]'>
                ${fundingGoal?.toLocaleString() || '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-2'>
          <Button
            onClick={handleViewDetails}
            variant='secondary'
            leftIcon={<EyeIcon className='w-5 h-5' />}
            className='flex-1 px-4 py-3 rounded-[12px] text-[16px] font-medium tracking-[-0.16px]'
          >
            Details
          </Button>
          <Button
            onClick={handleInvest}
            variant='primary'
            leftIcon={<InvestIcon className='w-5 h-5' />}
            className='flex-1 px-4 py-3 rounded-[12px] text-[16px] font-medium tracking-[-0.16px]'
          >
            Invest
          </Button>
        </div>
      </div>
    </div>
  );
}

export default StartupCard;
