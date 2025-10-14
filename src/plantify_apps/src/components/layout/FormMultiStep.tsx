import {
  CircleArrowLeft,
  CircleArrowRight,
  CircleCheckBig,
  Loader2,
} from 'lucide-react';
import { ReactNode } from 'react';

import { Button } from '@/components/ui';

export interface Step {
  id: number;
  label: string;
  icon: ReactNode;
  content: ReactNode;
}

interface FormMultiStepProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onSubmit: () => void;
  loading?: boolean;
  disableSubmit?: boolean;
}

export default function FormMultiStep({
  steps,
  currentStep,
  onStepChange,
  onSubmit,
  loading = false,
  disableSubmit = false,
}: FormMultiStepProps) {
  const nextStep = () =>
    currentStep < steps.length && onStepChange(currentStep + 1);
  const prevStep = () => currentStep > 1 && onStepChange(currentStep - 1);

  return (
    <div>
      {/* Tabs */}
      <div className='flex justify-center mb-8'>
        <div className='flex items-center space-x-2 bg-white rounded-full p-2 shadow-sm max-w-7xl w-full'>
          {steps.map((tab, index) => (
            <div key={tab.id} className='flex items-center w-full'>
              <button
                className={`flex justify-center items-center gap-[6px] flex-1
                  px-4 py-2 rounded-[12px] text-sm font-medium transition-all duration-200
                  ${
                    currentStep === tab.id
                      ? 'bg-[#F5F5F5] shadow text-gray-900'
                      : currentStep > tab.id
                        ? 'bg-gray-100 text-gray-600'
                        : 'text-gray-400'
                  }`}
                onClick={() => onStepChange(tab.id)}
              >
                {tab.icon}
                <span className='hidden sm:inline'>{tab.label}</span>
              </button>
              {index < steps.length - 1 && (
                <div className='w-8 h-px bg-gray-200 mx-1'></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className='bg-white rounded-2xl shadow-sm p-8'>
        {steps.find(s => s.id === currentStep)?.content}
      </div>

      {/* Navigation Buttons */}
      <div className='flex justify-between mt-2 pt-6 border-t border-gray-100'>
        {currentStep > 1 ? (
          <Button onClick={prevStep} variant='secondary'>
            <CircleArrowLeft size={16} /> Previous
          </Button>
        ) : (
          <div></div>
        )}

        {currentStep < steps.length ? (
          <Button onClick={nextStep} disabled={loading} variant='primary'>
            Next <CircleArrowRight size={16} />
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={loading || disableSubmit}
            variant='primary'
          >
            {loading ? (
              <>
                <Loader2 size={16} className='animate-spin' />
                Registering...
              </>
            ) : (
              <>
                <CircleCheckBig size={16} /> Complete Registration
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
