import { useState } from 'react';
import { CircleArrowRight, CircleArrowLeft } from 'lucide-react';

export default function ProfessionalBackgroundForm({
  formData,
  handleInputChange,
  nextStep,
  prevStep,
}) {
  const handleChange = (field, value) => {
    if (handleInputChange) {
      handleInputChange(field, value);
    }
  };

  const inputStyle = `
        w-full flex items-center gap-2 px-4 py-3 
        rounded-xl border border-gray-200 bg-white 
        shadow-md text-gray-900 placeholder-gray-400
        focus:ring-2 focus:ring-blue-500 focus:border-transparent 
        transition-all duration-200 text-[16px]
    `;

  return (
    <div>
      <h2 className='text-2xl font-semibold text-gray-900 mb-8 font-ibm'>
        Professional Background
      </h2>

      <div className='space-y-6'>
        {/* Business Experience */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Business Experience <span className='text-red-500'>*</span>
          </label>
          <textarea
            placeholder='Describe your business and entrepreneurial experience (minimum 6 months)'
            value={formData.experience || ''}
            onChange={e => handleChange('experience', e.target.value)}
            rows={4}
            className={`${inputStyle} resize-none`}
          />
        </div>

        {/* Previous Business */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Previous Business
          </label>
          <textarea
            placeholder="List any previous businesses you've started or managed"
            value={formData.previousBusinesses || ''}
            onChange={e => handleChange('previousBusinesses', e.target.value)}
            rows={3}
            className={`${inputStyle} resize-none`}
          />
        </div>

        {/* Area of Expertise 1 */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Area of Expertise <span className='text-red-500'>*</span>
          </label>
          <textarea
            placeholder='Describe your main skills and areas of expertise'
            value={formData.expertise || ''}
            onChange={e => handleChange('expertise', e.target.value)}
            rows={3}
            className={`${inputStyle} resize-none`}
          />
        </div>

        {/* LinkedIn Profile */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            LinkedIn Profile
          </label>
          <input
            type='url'
            placeholder='Enter your LinkedIn profile URL here'
            value={formData.linkedIn || ''}
            onChange={e => handleChange('linkedIn', e.target.value)}
            className={inputStyle}
          />
        </div>
      </div>
    </div>
  );
}
