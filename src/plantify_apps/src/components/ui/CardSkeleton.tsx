import React from 'react';

import { Skeleton, SkeletonText } from '@/components/ui';

interface CardSkeletonProps {
    withImage?: boolean;
    textRows?: number;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({
  withImage = true,
  textRows = 3,
}) => {
  return (
    <div className="bg-neutral-100 p-6 rounded-[16px] animate-pulse space-y-4">
      <Skeleton height={24} width="40%" />
      <SkeletonText lines={textRows} />

      {withImage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton height={120} />
          <Skeleton height={120} />
        </div>
      )}
    </div>
  );
};

export default CardSkeleton;
