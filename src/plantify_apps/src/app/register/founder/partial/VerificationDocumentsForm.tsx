import { Input, FileUpload } from '@/components/ui';

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

interface VerificationFormFields {
  idNumber?: string;
  taxNumber?: string;
  governmentIdFile?: File;
  taxIdFile?: File;
}

interface VerificationDocumentsFormProps {
  formData: VerificationFormFields;
  handleInputChange: <K extends keyof (FormData & VerificationFormFields)>(
    field: K,
    value: (FormData & VerificationFormFields)[K]
  ) => void;
}

function VerificationDocumentsForm({
  formData,
  handleInputChange,
}: VerificationDocumentsFormProps) {
  const handleChange = (
    field: 'idNumber' | 'taxNumber',
    value: string
  ): void => {
    handleInputChange(field, value);
  };

  const handleFileChange = (
    field: keyof VerificationFormFields,
    files: FileList | File[]
  ): void => {
    if (files && files.length > 0) {
      handleInputChange(field, files[0]);
    }
  };

  return (
    <div>
      <h2 className='text-2xl font-semibold text-gray-900 mb-8 font-ibm'>
        Verification Documents
      </h2>

      <div className='space-y-8'>
        <Input
          type='text'
          label='Government ID number'
          placeholder='Enter your government-issued ID number (SSN, Passport, etc.)'
          value={formData.idNumber ?? ''}
          onChange={e => handleChange('idNumber', e.target.value)}
          required
        />

        <Input
          type='text'
          label='Tax ID number'
          placeholder='Enter your tax identification number'
          value={formData.taxNumber ?? ''}
          onChange={e => handleChange('taxNumber', e.target.value)}
          required
        />

        <div>
          <h3 className='text-lg text-gray-900 mb-6 font-ibm'>
            Document Upload
          </h3>

          <div className='space-y-6'>
            <FileUpload
              label='Government ID document'
              accept='image/*,.pdf'
              fileTypes='jpg, png, or pdf'
              maxSize='2MB'
              onFileSelect={files =>
                handleFileChange('governmentIdFile', files)
              }
            />

            <FileUpload
              label='Tax ID document'
              accept='image/*,.pdf'
              fileTypes='jpg, png, or pdf'
              maxSize='2MB'
              onFileSelect={files => handleFileChange('taxIdFile', files)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationDocumentsForm;
