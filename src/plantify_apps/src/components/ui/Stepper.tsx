'use client';

import React from 'react';

import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export interface StepperStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
}

interface StepperProps {
  steps: StepperStep[];
  currentStep?: number;
  className?: string;
}

export default function Stepper({
  steps,
  currentStep,
  className = '',
}: StepperProps) {
  const getStepIcon = (step: StepperStep, index: number) => {
    const isCurrentStep = currentStep === index;
    const isCompleted = step.status === 'completed';
    const isError = step.status === 'error';
    const isInProgress = step.status === 'in_progress';

    if (isError) {
      return <AlertCircle className='w-5 h-5 text-red-500' />;
    }

    if (isCompleted) {
      return <CheckCircle className='w-5 h-5 text-green-500' />;
    }

    if (isInProgress || isCurrentStep) {
      return (
        <div className='w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin' />
      );
    }

    return (
      <div className='w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center'>
        <span className='text-xs font-medium text-gray-500'>{index + 1}</span>
      </div>
    );
  };

  const getStepStatusColor = (step: StepperStep) => {
    switch (step.status) {
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'in_progress':
        return 'text-purple-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Purchase Progress
        </h3>
        <div className='text-sm text-gray-500'>
          Step {currentStep !== undefined ? currentStep + 1 : 0} of{' '}
          {steps.length}
        </div>
      </div>

      <div className='space-y-4'>
        {steps.map((step, index) => (
          <div key={step.id} className='relative'>
            {/* Connection Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute left-2.5 top-8 w-0.5 h-8 ${
                  step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}

            {/* Step Content */}
            <div className='flex items-start gap-3'>
              {/* Step Icon */}
              <div className='flex-shrink-0 mt-0.5'>
                {getStepIcon(step, index)}
              </div>

              {/* Step Details */}
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1'>
                  <h4
                    className={`text-sm font-medium ${getStepStatusColor(step)}`}
                  >
                    {step.title}
                  </h4>
                  {step.status === 'in_progress' && (
                    <div className='flex items-center gap-1 text-xs text-purple-600'>
                      <Clock className='w-3 h-3' />
                      <span>Processing...</span>
                    </div>
                  )}
                </div>
                <p className='text-sm text-gray-600'>{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
