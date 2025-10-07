import { Check } from 'lucide-react';
import React from 'react';

interface TermsAgreementFormData {
  terms: boolean;
  risks: boolean;
  transparency: boolean;
}

interface TermsAgreementFormProps {
  formData: TermsAgreementFormData;
  handleInputChange: (field: keyof TermsAgreementFormData, value: boolean) => void;
}

function TermsAgreementForm({ formData, handleInputChange }: TermsAgreementFormProps) {
  const handleCheckboxChange = (field: keyof TermsAgreementFormData) => {
    if (handleInputChange) {
      handleInputChange(field, !formData[field]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold font-ibm text-gray-900 mb-6">
        Terms & Agreement
      </h2>

      {/* Founder Responsibilities */}
      <div className="mb-8">
        <h3 className="text-lg font-ibm text-gray-800 mb-3">
          I understand investment risks
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>Conduct due diligence before making investments</li>
          <li>Participate actively in monthly governance voting</li>
          <li>Respect the long-term commitment (36 months)</li>
          <li>Engage constructively with startup founders and community</li>
          <li>Report any suspicious activity or platform issues</li>
        </ul>
      </div>

      {/* Agreements List */}
      <div className="space-y-4">
        {/* Terms & Conditions */}
        <div
          className={`flex flex-col gap-1 p-4 rounded-xl border transition cursor-pointer ${formData.terms
            ? 'border-blue-500 bg-blue-50'
            : 'border-neutral-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => handleCheckboxChange('terms')}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-5 h-5 flex items-center justify-center rounded-md border ${formData.terms ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
              }`}
            >
              {formData.terms && <Check className="w-4 h-4 text-white" />}
            </div>
            <div>
              <div className="font-medium text-gray-900 text-[16px]">
                I agree to Plantify Terms & Conditions
              </div>
              <p className="text-sm text-gray-600">
                I have read and understand the platform terms, investment risks,
                and community guidelines for investors.
              </p>
            </div>
          </div>
        </div>

        {/* Risks and Commitments */}
        <div
          className={`flex flex-col gap-1 p-4 rounded-xl border transition cursor-pointer ${formData.risks
            ? 'border-blue-500 bg-blue-50'
            : 'border-neutral-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => handleCheckboxChange('risks')}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-5 h-5 flex items-center justify-center rounded-md border ${formData.risks ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
              }`}
            >
              {formData.risks && <Check className="w-4 h-4 text-white" />}
            </div>
            <div>
              <div className="font-medium text-gray-900 text-[16px]">
                I understand the risks and commitments
              </div>
              <p className="text-sm text-gray-600">
                I understand that startup investments are high-risk and I may
                lose money. I am investing only funds I can afford to lose.
              </p>
            </div>
          </div>
        </div>

        {/* Transparency and Community Values */}
        <div
          className={`flex flex-col gap-1 p-4 rounded-xl border transition cursor-pointer ${formData.transparency
            ? 'border-blue-500 bg-blue-50'
            : 'border-neutral-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => handleCheckboxChange('transparency')}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-5 h-5 flex items-center justify-center rounded-md border ${formData.transparency ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
              }`}
            >
              {formData.transparency && (
                <Check className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900 text-[16px]">
                I commit to transparency and community values
              </div>
              <p className="text-sm text-gray-600">
                I will participate in monthly voting, conduct proper due
                diligence, and contribute positively to the community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsAgreementForm;
