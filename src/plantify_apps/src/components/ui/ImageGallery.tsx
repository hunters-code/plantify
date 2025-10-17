'use client';

import { useState, HTMLAttributes } from 'react';

import Image from 'next/image';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps extends HTMLAttributes<HTMLDivElement> {
  nftImage?: string;
  companyImages?: string[];
  className?: string;
}

export default function ImageGallery({
  nftImage,
  companyImages = [],
  className = '',
  ...props
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Combine nftImage as first image, then companyImages
  const allImages = [nftImage, ...companyImages].filter(
    img => img && !img.includes('undefined')
  );

  // If no images, use default
  const images =
    allImages.length > 0 ? allImages : ['/assets/images/product.png'];

  if (!images || images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={`relative ${className}`} {...props}>
      {/* Main Image Container */}
      <div className='relative rounded-3xl overflow-hidden'>
        <Image
          src={images[activeIndex] || '/assets/images/product.png'}
          alt='Product'
          height={400}
          width={10000}
          className='object-cover w-full h-[400px] transition-all duration-500'
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            {/* Left Button */}
            <button
              onClick={goToPrevious}
              className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors'
              aria-label='Previous image'
            >
              <ChevronLeft size={24} className='text-gray-800' />
            </button>

            {/* Right Button */}
            <button
              onClick={goToNext}
              className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors'
              aria-label='Next image'
            >
              <ChevronRight size={24} className='text-gray-800' />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeIndex === i ? 'bg-white w-6' : 'bg-white/50'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
