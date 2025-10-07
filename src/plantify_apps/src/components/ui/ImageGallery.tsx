'use client';

import { Eye } from 'lucide-react';
import React, { useState, HTMLAttributes } from 'react';

interface ImageGalleryProps extends HTMLAttributes<HTMLDivElement> {
  images?: string[];
  className?: string;
  showViewMore?: boolean;
  onViewMore?: () => void;
}

export default function ImageGallery({
  images = [],
  className = '',
  showViewMore = false,
  onViewMore,
  ...props
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={className} {...props}>
      {/* Main Image */}
      <div className="rounded-xl overflow-hidden shadow-md">
        <img
          src={images[activeIndex]}
          alt="Product"
          width={600}
          height={400}
          className="object-cover w-full h-[350px] transition-all duration-300"
        />
      </div>

      {/* Thumbnail List */}
      <div className="flex gap-3 mt-4">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-20 h-20 rounded-lg overflow-hidden shadow cursor-pointer border-2 transition-all duration-200 ${activeIndex === i ? 'border-purple-500' : 'border-transparent'
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${i}`}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
        ))}

        {showViewMore && (
          <div
            className="relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer"
            onClick={onViewMore}
          >
            {/* Background Image */}
            <img
              src={images[0] || '/assets/images/product.png'}
              alt="View More"
              className="object-cover w-full h-full"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-purple-600 bg-opacity-70 flex flex-col items-center justify-center text-white font-medium">
              <Eye size={16} />
              <span className="text-xs">View More</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
