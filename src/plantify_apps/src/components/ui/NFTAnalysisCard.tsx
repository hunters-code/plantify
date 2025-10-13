'use client';

import Image from 'next/image';
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { Button } from '.';
import { Sparkle } from 'lucide-react';

interface NFTAnalysisCardProps {
  startupId?: string;
  startupName?: string;
  onAnalyze?: (startupId: string) => Promise<void>;
  className?: string;
}

export default function NFTAnalysisCard({
  startupId,
  startupName,
  onAnalyze,
  className = '',
}: NFTAnalysisCardProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeClick = async () => {
    if (!startupId || !onAnalyze) return;

    setIsAnalyzing(true);
    try {
      await onAnalyze(startupId);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Background Image */}
      <Image
        src='/assets/images/bg-nft.webp'
        alt='NFT Background'
        fill
        priority
        className='object-cover absolute inset-0 z-0 rounded-2xl'
        unoptimized
      />

      {/* Content Container */}
      <div className='relative z-10 p-10 pb-8 flex flex-col items-center justify-end gap-5 min-h-[400px] h-full text-white'>
        {/* Text Section */}
        <div className='text-center'>
          <h2 className="text-xl font-medium font-['IBM_Plex_Serif'] leading-[1.4] tracking-[-0.02em] max-w-sm mx-auto">
            Try to analyze this StartUp using PlantifyAI
          </h2>
          {startupName && (
            <p className='text-sm text-gray-200 mt-2'>Startup: {startupName}</p>
          )}
        </div>

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyzeClick}
          disabled={isAnalyzing || !startupId}
          variant='secondary'
          className={`group relative text-[#0A0A0A] font-medium text-base font-['Geist'] leading-[1.4] tracking-[-0.01em]
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        ${isAnalyzing ? 'cursor-wait' : ''}
      `}
        >
          <div className='w-5 h-5 flex items-center justify-center'>
            {isAnalyzing ? <LoadingSpinner size='sm' /> : <Sparkle size={16} />}
          </div>
          <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Now'}</span>
        </Button>
      </div>
    </div>
  );
}
