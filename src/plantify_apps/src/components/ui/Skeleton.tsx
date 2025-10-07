import clsx from 'clsx';
import React from 'react';

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    circle?: boolean;
    className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  circle = false,
  className,
}) => {
  return (
    <div
      className={clsx('animate-pulse bg-gray-300 rounded', className, {
        'rounded-full': circle,
      })}
      style={{ width, height }}
    />
  );
};

export default Skeleton;
