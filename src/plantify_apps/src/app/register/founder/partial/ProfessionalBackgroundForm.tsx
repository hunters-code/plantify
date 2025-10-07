import { CircleArrowRight, CircleArrowLeft } from 'lucide-react';

import { Input, Textarea } from '@/components/ui';

interface ProfessionalBackgroundFormProps {
  formData: {
    experience?: string;
    previousBusinesses?: string;
    expertise?: string;
    linkedIn?: string;
  };
  handleInputChange?: (field: string, value: string) => void;
  nextStep?: () => void;
  prevStep?: () => void;
}

export default function ProfessionalBackgroundForm({
  formData,
  handleInputChange,
  nextStep,
  prevStep,
}: ProfessionalBackgroundFormProps) {
  const handleChange = (field: string, value: string) => {
    if (handleInputChange) {
      handleInputChange(field, value);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-8 font-ibm">
        Professional Background
      </h2>

      <div className="space-y-6">
        <Textarea
          label="Business Experience"
          placeholder="Describe your business and entrepreneurial experience (minimum 6 months)"
          value={formData.experience || ''}
          onChange={(e) => handleChange('experience', e.target.value)}
          rows={4}
          required
        />

        <Textarea
          label="Previous Business"
          placeholder="List any previous businesses you've started or managed"
          value={formData.previousBusinesses || ''}
          onChange={(e) => handleChange('previousBusinesses', e.target.value)}
          rows={3}
        />

        <Textarea
          label="Area of Expertise"
          placeholder="Describe your main skills and areas of expertise"
          value={formData.expertise || ''}
          onChange={(e) => handleChange('expertise', e.target.value)}
          rows={3}
          required
        />

        <Input
          type="url"
          label="LinkedIn Profile"
          placeholder="Enter your LinkedIn profile URL here"
          value={formData.linkedIn || ''}
          onChange={(e) => handleChange('linkedIn', e.target.value)}
        />
      </div>
    </div>
  );
}
