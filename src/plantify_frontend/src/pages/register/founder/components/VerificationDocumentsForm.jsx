import { useState } from 'react';
import { Upload, File, FileUp } from 'lucide-react';

// File Upload Component
function FileUpload({
  label,
  required = false,
  acceptedFormats = 'jpg, png, or pdf max 2MB',
  onChange,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (onChange) onChange(file);
    }
  };

  const handleChange = e => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (onChange) onChange(file);
    }
  };

  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      <div
        className={`relative flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : selectedFile
              ? 'border-green-400 bg-green-50'
              : 'border-neutral-200 bg-white hover:border-gray-300 shadow-sm'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type='file'
          className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
          onChange={handleChange}
          accept='.jpg,.jpeg,.png,.pdf'
        />

        {selectedFile ? (
          <div className='flex flex-col items-center gap-1'>
            <File className='w-8 h-8 text-green-500' />
            <div className='text-sm font-medium text-green-700'>
              {selectedFile.name}
            </div>
            <div className='text-xs text-green-600'>
              File uploaded successfully
            </div>
          </div>
        ) : (
          <div className='flex items-center gap-3 text-center'>
            <div className='w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2'>
              <FileUp size={24} />
            </div>
            <div className='flex flex-col gap-1 text-left'>
              <div className='text-gray-900 font-medium'>
                Choose or drag the file here
              </div>
              <div className='text-sm text-gray-500'>({acceptedFormats})</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Verification Documents Form Component
function VerificationDocumentsForm({ formData, handleInputChange }) {
  const [verificationData, setVerificationData] = useState({
    governmentId: formData.governmentId || '',
    taxId: formData.taxId || '',
    governmentIdFile: null,
    taxIdFile: null,
  });

  const handleChange = (field, value) => {
    setVerificationData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (handleInputChange) {
      handleInputChange(field, value);
    }
  };

  const handleFileChange = (field, file) => {
    setVerificationData(prev => ({
      ...prev,
      [field]: file,
    }));
    if (handleInputChange) {
      handleInputChange(field, file);
    }
  };

  return (
    <div>
      <h2 className='text-2xl font-semibold text-gray-900 mb-8 font-ibm'>
        Verification Documents
      </h2>

      <div className='space-y-8'>
        {/* Government ID Number */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Government ID number <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            placeholder='Enter your government-issued ID number (SSN, Passport, etc.)'
            value={verificationData.governmentId}
            onChange={e => handleChange('governmentId', e.target.value)}
            className='flex w-full px-4 py-3 items-center gap-1.5 self-stretch rounded-xl border border-neutral-200 bg-white shadow-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-[16px]'
          />
        </div>

        {/* Tax ID Number */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Tax ID number <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            placeholder='Enter your tax identification number'
            value={verificationData.taxId}
            onChange={e => handleChange('taxId', e.target.value)}
            className='flex w-full px-4 py-3 items-center gap-1.5 self-stretch rounded-xl border border-neutral-200 bg-white shadow-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-[16px]'
          />
        </div>

        {/* Document Upload Section */}
        <div>
          <h3 className='text-lg text-gray-900 mb-6 font-ibm'>
            Document Upload
          </h3>

          <div className='space-y-6'>
            {/* Government ID Document */}
            <FileUpload
              label='Government ID document'
              required={true}
              acceptedFormats='jpg, png, or pdf max 2MB'
              onChange={file => handleFileChange('governmentIdFile', file)}
            />

            {/* Tax ID Document */}
            <FileUpload
              label='Tax ID document'
              required={true}
              acceptedFormats='jpg, png, or pdf max 2MB'
              onChange={file => handleFileChange('taxIdFile', file)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationDocumentsForm;
