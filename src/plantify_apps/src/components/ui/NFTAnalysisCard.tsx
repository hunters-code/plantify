'use client';

import { useState } from 'react';
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';

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
    <div className={`relative overflow-hidden ${className}`}>
      {/* Main Card Container */}
      <div className='relative bg-gradient-to-b from-[#0A0A0A] via-[#512CE1] to-[#0A0A0A] rounded-2xl p-10 pb-8 flex flex-col items-center gap-16 min-h-[400px]'>
        {/* Background Decorative Elements */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          {/* Main Background Blur Effects using grey.png asset */}
          <div className='absolute -top-[119px] -left-[2px] w-[321px] h-[331px]'>
            <Image
              src='/assets/images/grey.png'
              alt=''
              width={321}
              height={331}
              className='absolute inset-0 w-full h-full object-cover opacity-80'
              unoptimized
            />
          </div>

          {/* Scattered Glow Dots */}
          <div className='absolute top-[38px] right-[173px] w-[5.43px] h-[5.43px] bg-white rounded-full shadow-[0_0_0.48px_rgba(255,255,255,1),0_0_0.96px_rgba(255,255,255,1),0_0_3.36px_rgba(255,255,255,1),0_0_6.72px_rgba(255,255,255,1),0_0_11.52px_rgba(255,255,255,1),0_0_20.16px_rgba(255,255,255,1)]' />
          <div className='absolute top-[68.65px] right-[162.65px] w-[5.52px] h-[5.52px] bg-white rounded-full shadow-[0_0_1.05px_rgba(255,255,255,1),0_0_2.1px_rgba(255,255,255,1),0_0_7.35px_rgba(255,255,255,1),0_0_14.71px_rgba(255,255,255,1),0_0_25.21px_rgba(255,255,255,1),0_0_44.12px_rgba(255,255,255,1)]' />
          <div className='absolute top-[49px] left-[119px] w-[9.64px] h-[9.64px] bg-white rounded-full shadow-[0_0_1.05px_rgba(255,255,255,1),0_0_2.1px_rgba(255,255,255,1),0_0_7.35px_rgba(255,255,255,1),0_0_14.71px_rgba(255,255,255,1),0_0_25.21px_rgba(255,255,255,1),0_0_44.12px_rgba(255,255,255,1)]' />
          <div className='absolute top-[49px] left-[127px] w-[3.52px] h-[3.52px] bg-white rounded-full shadow-[0_0_1.05px_rgba(255,255,255,1),0_0_2.1px_rgba(255,255,255,1),0_0_7.35px_rgba(255,255,255,1),0_0_14.71px_rgba(255,255,255,1),0_0_25.21px_rgba(255,255,255,1),0_0_44.12px_rgba(255,255,255,1)]' />
        </div>

        {/* Plantify Logo */}
        <div className='relative z-10 w-11 h-11 flex items-center justify-center'>
          <div className='w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-[0_0_2.97px_rgba(255,255,255,1),0_0_5.94px_rgba(255,255,255,1),0_0_20.79px_rgba(255,255,255,1),0_0_41.58px_rgba(255,255,255,1),0_0_71.28px_rgba(255,255,255,1),0_0_124.74px_rgba(255,255,255,1)]'>
            {/* Plantify Logo SVG - you can replace this with your actual logo */}
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z'
                fill='#512CE1'
              />
            </svg>
          </div>
        </div>

        {/* Content Section */}
        <div className='relative z-10 flex flex-col items-center gap-6 w-full'>
          {/* Main Text */}
          <h2 className="text-white text-xl font-medium font-['IBM_Plex_Serif'] text-center leading-[1.4] tracking-[-0.02em] max-w-sm">
            Try to analyze this StartUp using PlantifyAI
          </h2>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyzeClick}
            disabled={isAnalyzing || !startupId}
            className='group relative bg-white border border-gradient-to-b from-[#E5E5E5] to-white rounded-xl px-4 py-3 flex items-center gap-1.5 shadow-[0_2px_4px_rgba(0,0,0,0.16),inset_0_-2px_1px_rgba(0,0,0,0.25),inset_0_3px_3px_rgba(255,255,255,0.4)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_-2px_1px_rgba(0,0,0,0.3),inset_0_3px_3px_rgba(255,255,255,0.5)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {/* AI Sparkle Icon */}
            <div className='w-5 h-5 flex items-center justify-center'>
              {isAnalyzing ? (
                <LoadingSpinner size='sm' />
              ) : (
                <Image
                  src='/assets/images/ai-sparkle-icon.svg'
                  alt='AI Sparkle'
                  width={20}
                  height={20}
                  className='group-hover:scale-110 transition-transform duration-200'
                />
              )}
            </div>

            {/* Button Text */}
            <span className="text-[#0A0A0A] font-medium text-base font-['Geist'] leading-[1.4] tracking-[-0.01em]">
              {isAnalyzing ? 'Analyzing...' : 'Analyze Now'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
