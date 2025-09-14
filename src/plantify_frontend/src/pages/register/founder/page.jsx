import { useState } from 'react';
import {
  User,
  Briefcase,
  CheckCircle,
  FileText,
  ArrowRight,
  CircleArrowRight,
  CircleCheckBig,
  CircleArrowLeft,
} from 'lucide-react';
import { Navbar, Footer } from '../../../components';
import PersonalInformationForm from './components/PersonalInformationForm';
import ProfessionalBackgroundForm from './components/ProfessionalBackgroundForm';
import VerificationDocumentsForm from './components/VerificationDocumentsForm';
import TermsAgreementForm from './components/TermsAgreementForm';

export default function RegisterFounder() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  const tabs = [
    {
      id: 1,
      label: 'Personal Information',
      icon: <User className='w-4 h-4' />,
    },
    {
      id: 2,
      label: 'Professional Background',
      icon: <Briefcase className='w-4 h-4' />,
    },
    { id: 3, label: 'Verification', icon: <CheckCircle className='w-4 h-4' /> },
    {
      id: 4,
      label: 'Terms & Agreement',
      icon: <FileText className='w-4 h-4' />,
    },
  ];

  const nextStep = () => {
    if (step < tabs.length) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className='bg-gray-50 text-gray-900 min-h-screen'>
      <Navbar />

      <div className='max-w-7xl mx-auto mt-8 mb-8'>
        {/* Progress Steps */}
        <div className='flex justify-center mb-8'>
          <div className='flex items-center space-x-2 bg-white rounded-full p-2 shadow-sm max-w-7xl w-full'>
            {tabs.map((tab, index) => (
              <div key={tab.id} className='flex items-center w-full'>
                <button
                  className={`
            flex justify-center items-center gap-[6px] flex-1
            px-4 py-2 rounded-[12px] text-sm font-medium transition-all duration-200
            ${
              step === tab.id
                ? 'bg-[#F5F5F5] shadow-[inset_0_3px_3px_rgba(255,255,255,0.4),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)] text-gray-900'
                : step > tab.id
                  ? 'bg-gray-100 text-gray-600'
                  : 'text-gray-400'
            }`}
                  onClick={() => setStep(tab.id)}
                >
                  {tab.icon}
                  <span className='hidden sm:inline'>{tab.label}</span>
                </button>
                {index < tabs.length - 1 && (
                  <div className='w-8 h-px bg-gray-200 mx-1'></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className='bg-neutral-100 rounded-2xl shadow-sm p-8'>
          {step === 1 && (
            <PersonalInformationForm
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {step === 2 && (
            <ProfessionalBackgroundForm
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {step === 3 && (
            <VerificationDocumentsForm
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {step === 4 && (
            <TermsAgreementForm
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}
        </div>

        {/* Navigation */}
        <div className='flex justify-between mt-2 pt-6 border-t border-gray-100'>
          {/* Previous Button */}
          {step > 1 ? (
            <button
              onClick={prevStep}
              className='flex justify-center items-center gap-[6px] px-4 py-3 rounded-[12px] border border-[#E5E5E5] bg-[#F5F5F5] shadow-[inset_0_3px_3px_rgba(255,255,255,0.40),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)] text-gray-900 font-medium text-[16px]'
            >
              <CircleArrowLeft size={16} /> Previous
            </button>
          ) : (
            <div></div>
          )}

          {/* Next / Submit Button */}
          {step < tabs.length ? (
            <button
              onClick={nextStep}
              className='flex justify-center items-center gap-[6px] px-4 py-3 rounded-[12px] border border-white/20 bg-[#7A5AF8] shadow-[inset_0_3px_3px_rgba(255,255,255,0.40),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)] text-white font-medium transition-all duration-200 hover:opacity-90 text-[16px]'
            >
              Next <CircleArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={nextStep}
              className='flex justify-center items-center gap-[6px] px-4 py-3 rounded-[12px] border border-white/20 bg-[#7A5AF8] shadow-[inset_0_3px_3px_rgba(255,255,255,0.40),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)] text-white font-medium transition-all duration-200 hover:opacity-90 text-[16px]'
            >
              <CircleCheckBig size={16} /> Complete Registration
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
