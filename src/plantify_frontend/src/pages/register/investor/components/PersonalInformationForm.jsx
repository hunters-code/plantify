import { Input } from '../../../../components/ui';

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
        <Input
          type='text'
          label='Full name'
          placeholder='Enter your full name here'
          value={formData.fullName}
          onChange={e => handleInputChange('fullName', e.target.value)}
          required
        />

        <div className='grid md:grid-cols-2 gap-6'>
          <Input
            type='email'
            label='Email'
            placeholder='Enter your email here'
            value={formData.email}
            onChange={e => handleInputChange('email', e.target.value)}
            required
          />
          <Input
            type='tel'
            label='Phone number'
            placeholder='Enter your phone number here'
            value={formData.phone}
            onChange={e => handleInputChange('phone', e.target.value)}
            required
          />
        </div>

        <div className='grid md:grid-cols-2 gap-6'>
          <Input
            type='text'
            label='Country'
            placeholder='Enter your country here'
            value={formData.country}
            onChange={e => handleInputChange('country', e.target.value)}
            required
          />
          <Input
            type='text'
            label='City'
            placeholder='Enter your city here'
            value={formData.city}
            onChange={e => handleInputChange('city', e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
}
