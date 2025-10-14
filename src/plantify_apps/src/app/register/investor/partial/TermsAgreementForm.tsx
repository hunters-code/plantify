import { Check } from 'lucide-react';
import React from 'react';

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

interface TermsAgreementFormData {
  terms: boolean;
  risks: boolean;
  transparency: boolean;
}

interface TermsAgreementFormProps {
  formData: TermsAgreementFormData;
  handleInputChange: <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => void;
}

function TermsAgreementForm({
  formData,
  handleInputChange,
}: TermsAgreementFormProps) {
  const handleCheckboxChange = (field: 'terms' | 'risks' | 'transparency') => {
    handleInputChange(field, !formData[field]);
  };

  const allChecked = formData.terms && formData.risks && formData.transparency;

  return (
    <div>
      <h2 className='text-2xl font-semibold font-ibm text-gray-900 mb-2'>
        Terms & Agreement
      </h2>
      <p className='text-gray-600 mb-6'>
        Please read and accept the following terms to complete your investor
        registration. All items must be checked to proceed.
      </p>

      {/* Investor Responsibilities */}
      <div className='mb-8'>
        <h3 className='text-lg font-ibm text-gray-800 mb-3'>
          Investor Responsibilities
        </h3>
        <ul className='list-disc list-inside text-gray-600 space-y-1 text-sm'>
          <li>Conduct due diligence before making investments</li>
          <li>Participate actively in monthly governance voting</li>
          <li>Respect the long-term commitment (36 months lock period)</li>
          <li>Engage constructively with startup founders and community</li>
          <li>Report any suspicious activity or platform issues</li>
        </ul>
      </div>

      {/* Agreements List */}
      <div className='space-y-4'>
        {/* Terms & Conditions */}
        <div
          className={`flex flex-col gap-1 p-4 rounded-xl border transition cursor-pointer ${
            formData.terms
              ? 'border-blue-500 bg-blue-50'
              : 'border-neutral-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => handleCheckboxChange('terms')}
        >
          <div className='flex items-start gap-3'>
            <div
              className={`w-5 h-5 flex items-center justify-center rounded-md border flex-shrink-0 ${
                formData.terms
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300'
              }`}
            >
              {formData.terms && <Check className='w-4 h-4 text-white' />}
            </div>
            <div>
              <div className='font-medium text-gray-900 text-[16px]'>
                I agree to Plantify Terms & Conditions
              </div>
              <p className='text-sm text-gray-600'>
                I have read and understand the platform terms, investment risks,
                and community guidelines for investors.
              </p>
            </div>
          </div>
        </div>

        {/* Risks and Commitments */}
        <div
          className={`flex flex-col gap-1 p-4 rounded-xl border transition cursor-pointer ${
            formData.risks
              ? 'border-blue-500 bg-blue-50'
              : 'border-neutral-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => handleCheckboxChange('risks')}
        >
          <div className='flex items-start gap-3'>
            <div
              className={`w-5 h-5 flex items-center justify-center rounded-md border flex-shrink-0 ${
                formData.risks
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300'
              }`}
            >
              {formData.risks && <Check className='w-4 h-4 text-white' />}
            </div>
            <div>
              <div className='font-medium text-gray-900 text-[16px]'>
                I understand the risks and commitments
              </div>
              <p className='text-sm text-gray-600'>
                I understand that startup investments are high-risk and I may
                lose money. I am investing only funds I can afford to lose.
              </p>
            </div>
          </div>
        </div>

        {/* Transparency and Community Values */}
        <div
          className={`flex flex-col gap-1 p-4 rounded-xl border transition cursor-pointer ${
            formData.transparency
              ? 'border-blue-500 bg-blue-50'
              : 'border-neutral-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => handleCheckboxChange('transparency')}
        >
          <div className='flex items-start gap-3'>
            <div
              className={`w-5 h-5 flex items-center justify-center rounded-md border flex-shrink-0 ${
                formData.transparency
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300'
              }`}
            >
              {formData.transparency && (
                <Check className='w-4 h-4 text-white' />
              )}
            </div>
            <div>
              <div className='font-medium text-gray-900 text-[16px]'>
                I commit to transparency and community values
              </div>
              <p className='text-sm text-gray-600'>
                I will participate in monthly voting, conduct proper due
                diligence, and contribute positively to the community.
              </p>
            </div>
          </div>
        </div>
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
                Required
              </h4>
              <p className='text-amber-800 text-sm'>
                You must accept all terms and conditions above to complete your
                registration.
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
                Terms Accepted
              </h4>
              <p className='text-green-800 text-sm'>
                You have accepted all terms and conditions. Click
                &quot;Submit&quot; to complete your registration.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Important Notice */}
      <div className='mt-6 p-4 bg-white border border-gray-200 rounded-lg'>
        <div className='flex items-start gap-3'>
          <svg
            className='w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <div>
            <h4 className='font-semibold text-gray-900 text-sm mb-1'>
              Legal Notice
            </h4>
            <p className='text-gray-700 text-sm'>
              By checking these boxes, you are electronically signing this
              agreement and agreeing to be legally bound by its terms. Please
              ensure you have read and understood all terms before proceeding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsAgreementForm;
