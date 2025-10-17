import React from 'react';

import { CheckCircle, Clock, Loader2, XCircle } from 'lucide-react';

export interface PurchaseStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
}

interface PurchaseProgressProps {
  steps: PurchaseStep[];
  currentStep: number;
  className?: string;
}

export default function PurchaseProgress({
  steps,
  currentStep: _currentStep,
  className = '',
}: PurchaseProgressProps) {
  const getStepIcon = (step: PurchaseStep, _index: number) => {
    if (step.status === 'completed') {
      return <CheckCircle className='w-5 h-5 text-green-500' />;
    }
    if (step.status === 'error') {
      return <XCircle className='w-5 h-5 text-red-500' />;
    }
    if (step.status === 'in_progress') {
      return <Loader2 className='w-5 h-5 text-blue-500 animate-spin' />;
    }
    return <Clock className='w-5 h-5 text-gray-400' />;
  };

  const getStepStatusColor = (step: PurchaseStep) => {
    if (step.status === 'completed') {
      return 'text-green-600';
    }
    if (step.status === 'error') {
      return 'text-red-600';
    }
    if (step.status === 'in_progress') {
      return 'text-blue-600';
    }
    return 'text-gray-500';
  };

  return (
    <div className={`w-full ${className}`}>
      <div className='space-y-4'>
        {steps.map((step, index) => (
          <div key={step.id} className='flex items-start space-x-3'>
            <div className='flex-shrink-0'>{getStepIcon(step, index)}</div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center space-x-2'>
                <h3
                  className={`text-sm font-medium ${getStepStatusColor(step)}`}
                >
                  {step.title}
                </h3>
                {step.status === 'in_progress' && (
                  <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                    Processing...
                  </span>
                )}
                {step.status === 'completed' && (
                  <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                    Completed
                  </span>
                )}
                {step.status === 'error' && (
                  <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                    Failed
                  </span>
                )}
              </div>
              <p className='text-sm text-gray-500 mt-1'>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function createPurchaseSteps(): PurchaseStep[] {
  return [
    {
      id: 'validate',
      title: 'Validating Purchase',
      description: 'Checking your balance and purchase requirements',
      status: 'pending',
    },
    {
      id: 'transfer',
      title: 'Transfer ckUSDC',
      description: 'Transferring ckUSDC tokens to Plantify account',
      status: 'pending',
    },
    {
      id: 'confirm',
      title: 'Validate Transaction and Send NFT',
      description: 'Validating transaction and minting your NFT tokens',
      status: 'pending',
    },
    {
      id: 'complete',
      title: 'Purchase Complete',
      description: 'Your NFT has been successfully minted',
      status: 'pending',
    },
  ];
}
