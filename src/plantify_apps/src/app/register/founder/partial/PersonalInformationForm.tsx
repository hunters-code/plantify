import { Input, Textarea } from '@/components/ui';

interface PersonalInformationFormProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
  handleInputChange: (field: string, value: string) => void;
}

export default function PersonalInformationForm({
  formData,
  handleInputChange,
}: PersonalInformationFormProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold font-ibm text-gray-900 mb-8">
        Personal Information
      </h2>
      <div className="space-y-6">
        <Input
          type="text"
          label="Full name"
          placeholder="Enter your full name here"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          required
        />

        <div className="grid md:grid-cols-2 gap-6">
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email here"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
          <Input
            type="tel"
            label="Phone number"
            placeholder="Enter your phone number here"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required
          />
        </div>

        <Textarea
          label="Complete address"
          placeholder="Enter your address here"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          rows={4}
          required
        />
      </div>
    </div>
  );
}
