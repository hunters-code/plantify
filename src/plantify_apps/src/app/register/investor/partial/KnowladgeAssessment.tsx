import React from 'react';
import { Card } from '@/components/ui';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  investmentExperience: string;
  riskTolerance: string;
  investmentGoals: string;
  availableCapital: string;
  monthlyBudget: string;
  investmentRisks: boolean;
  nftModel: boolean;
  governance: boolean;
  liquidity: boolean;
  terms: boolean;
  risks: boolean;
  transparency: boolean;
}

type KnowledgeField =
  | 'investmentRisks'
  | 'nftModel'
  | 'governance'
  | 'liquidity';

interface KnowledgeAssessmentProps {
  formData: Pick<FormData, KnowledgeField>;
  handleInputChange: <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => void;
}

interface CheckboxItem {
  field: KnowledgeField;
  title: string;
  description: string;
}

export default function KnowledgeAssessment({
  formData,
  handleInputChange,
}: KnowledgeAssessmentProps) {
  const handleChange = (field: KnowledgeField, value: boolean): void => {
    handleInputChange(field, value);
  };

  const checkboxItems: CheckboxItem[] = [
    {
      field: 'investmentRisks',
      title: 'I understand investment risks',
      description:
        'Startup investments are high-risk and I may lose some or all of my investment. Returns are not guaranteed and depend on startup performance.',
    },
    {
      field: 'nftModel',
      title: 'I understand NFT investment model',
      description:
        'Each NFT represents profit sharing rights in a specific startup. Profit sharing is distributed monthly based on startup performance and community voting.',
    },
    {
      field: 'governance',
      title: 'I understand community governance',
      description:
        'I must participate in monthly voting to approve/reject startup progress reports. My vote affects whether profit sharing is distributed that month.',
    },
    {
      field: 'liquidity',
      title: 'I understand liquidity restrictions',
      description:
        'NFTs are locked for 36 months and cannot be sold or transferred. I will not have access to my initial investment capital during this period.',
    },
  ];

  const allChecked = checkboxItems.every(item => formData[item.field]);

  return (
    <div>
      <h2 className='text-2xl font-semibold text-gray-900 mb-2 font-ibm'>
        Knowledge Assessment
      </h2>
      <p className='text-gray-600 mb-8'>
        Please read and acknowledge the following important information about
        investing on our platform. All items must be checked to proceed.
      </p>

      <div className='space-y-4'>
        {checkboxItems.map((item, index) => (
          <Card
            key={item.field}
            className={`flex items-start gap-3 p-4 cursor-pointer transition-all duration-200 ${
              formData[item.field]
                ? 'border-blue-500 bg-blue-50'
                : 'border-neutral-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => handleChange(item.field, !formData[item.field])}
          >
            <div className='flex-shrink-0'>
              <div
                className={`w-5 h-5 flex items-center justify-center rounded border ${
                  formData[item.field]
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {formData[item.field] && (
                  <svg
                    className='w-4 h-4 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={3}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className='flex-1'>
              <div className='flex items-center gap-2'>
                <span className='inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-gray-600 bg-gray-200 rounded-full'>
                  {index + 1}
                </span>
                <div className='font-medium text-gray-900 text-[16px]'>
                  {item.title}
                </div>
              </div>
              <p className='text-sm text-gray-600 mt-2'>{item.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Warning Message */}
      {!allChecked && (
        <div className='mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg'>
          <div className='flex items-start gap-3'>
            <svg
              className='w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
            <div>
              <h4 className='font-semibold text-amber-900 text-sm mb-1'>
                Important
              </h4>
              <p className='text-amber-800 text-sm'>
                You must read and acknowledge all items above before proceeding
                to the next step. This ensures you understand the risks and
                commitments involved in platform investments.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {allChecked && (
        <div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
          <div className='flex items-start gap-3'>
            <svg
              className='w-5 h-5 text-green-600 mt-0.5 flex-shrink-0'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <div>
              <h4 className='font-semibold text-green-900 text-sm mb-1'>
                Knowledge Assessment Complete
              </h4>
              <p className='text-green-800 text-sm'>
                You have acknowledged all the important information. You can now
                proceed to the final step.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
