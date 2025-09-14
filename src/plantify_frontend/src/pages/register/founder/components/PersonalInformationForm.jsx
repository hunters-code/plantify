export default function PersonalInformationForm({
  formData,
  handleInputChange,
}) {
  return (
    <div>
      <h2 className='text-2xl font-semibold font-ibm text-gray-900 mb-8'>
        Personal Information
      </h2>
      <div className='space-y-6'>
        {/* Full name */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Full name <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            placeholder='Enter your full name here'
            value={formData.fullName}
            onChange={e => handleInputChange('fullName', e.target.value)}
            className='w-full flex items-center gap-[6px] px-4 py-3 rounded-[12px] border border-[#E5E5E5] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.16)] text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-[16px]'
          />
        </div>

        {/* Email + Phone */}
        <div className='grid md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Email <span className='text-red-500'>*</span>
            </label>
            <input
              type='email'
              placeholder='Enter your email here'
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              className='w-full flex items-center gap-[6px] px-4 py-3 rounded-[12px] border border-[#E5E5E5] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.16)] text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-[16px]'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Phone number <span className='text-red-500'>*</span>
            </label>
            <input
              type='tel'
              placeholder='Enter your phone number here'
              value={formData.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
              className='w-full flex items-center gap-[6px] px-4 py-3 rounded-[12px] border border-[#E5E5E5] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.16)] text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-[16px]'
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Complete address <span className='text-red-500'>*</span>
          </label>
          <textarea
            placeholder='Enter your address here'
            value={formData.address}
            onChange={e => handleInputChange('address', e.target.value)}
            rows={4}
            className='w-full flex items-center gap-[6px] px-4 py-3 rounded-[12px] border border-[#E5E5E5] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.16)] text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-[16px]'
          />
        </div>
      </div>
    </div>
  );
}
