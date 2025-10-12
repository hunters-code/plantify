import { Check } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
  previousBusinesses: string;
  expertise: string;
  linkedIn: string;
  idNumber: string;
  taxNumber: string;
  terms: boolean;
  risks: boolean;
  transparency: boolean;
}

interface TermsAgreementFormProps {
  formData: {
    terms: boolean;
    risks: boolean;
    transparency: boolean;
    [key: string]: any;
  };
  handleInputChange: (field: keyof FormData, value: any) => void;
}

function TermsAgreementForm({
  formData,
  handleInputChange,
}: TermsAgreementFormProps) {
  const handleCheckboxChange = (field: 'terms' | 'risks' | 'transparency') => {
    handleInputChange(field as keyof FormData, !formData[field]);
  };

  return (
    <div>
      <h2 className='text-2xl font-semibold font-ibm text-gray-900 mb-6'>
        Terms & Agreement
      </h2>

      {/* Founder Responsibilities */}
      <div className='mb-8'>
        <h3 className='text-lg font-ibm text-gray-800 mb-3'>
          Founder Responsibilities
        </h3>
        <ul className='list-disc list-inside text-gray-600 space-y-1 text-sm'>
          <li>
            Provide accurate and truthful information about your businesses
          </li>
          <li>Maintain transparent communication with investors</li>
          <li>Submit monthly progress reports on time</li>
          <li>Honor profit sharing commitments</li>
          <li>Maintain sufficient collateral for all active startups</li>
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
              className={`w-5 h-5 flex items-center justify-center rounded-md border ${
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
                I have read and understand the platform terms, founder
                obligations, and community guidelines.
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
              className={`w-5 h-5 flex items-center justify-center rounded-md border ${
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
                I understand that fundraising involves 36-month commitments,
                collateral requirements, and monthly reporting obligations.
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
              className={`w-5 h-5 flex items-center justify-center rounded-md border ${
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
                I will maintain open communication with investors and uphold the
                values of the Plantify community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsAgreementForm;
