import { Sparkle } from 'lucide-react';
import React from 'react';

import { ProgressBar } from '@/components/ui';
import { formatCurrency, formatNumber } from '@/utils/formatCurrency';

interface FundingProgressProps {
    progress: number; // persen
    totalRaised: number;
    fundingGoal: number;
    color?: 'orange' | 'blue' | 'green';
}

export default function FundingProgress({
  progress,
  totalRaised,
  fundingGoal,
  color = 'orange',
}: FundingProgressProps) {
  return (
    <div className="mb-6 flex gap-2">
      <Sparkle size={16} />
      <div className="w-full">
        {/* Progress Info */}
        <div className="flex gap-2 text-sm mb-2">
          <span className="text-gray-600">
                        Overall Progress:{' '}
            <span
              className={
                color === 'orange'
                  ? 'text-orange-500 font-medium'
                  : color === 'blue'
                    ? 'text-blue-500 font-medium'
                    : 'text-green-500 font-medium'
              }
            >
              {formatNumber(progress, 1)}% Funded
            </span>
          </span>
        </div>

        {/* Progress Bar */}
        <ProgressBar value={progress} max={100} className="mb-2" color={color} />

        {/* Amounts */}
        <div className="flex justify-between text-sm mt-2">
          <span
            className={
              color === 'orange'
                ? 'text-orange-600 font-medium'
                : color === 'blue'
                  ? 'text-blue-600 font-medium'
                  : 'text-green-600 font-medium'
            }
          >
            {formatCurrency(totalRaised)}
          </span>
          <span className="text-gray-500">{formatCurrency(fundingGoal)}</span>
        </div>
      </div>
    </div>
  );
}
