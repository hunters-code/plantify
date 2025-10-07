import { Upload } from 'lucide-react';
import React, { ChangeEvent, HTMLAttributes } from 'react';

interface FileUploadProps
  extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> {
  onFileSelect?: (files: File[]) => void;
  accept?: string;
  maxSize?: string;
  fileTypes?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export default function FileUpload({
  onFileSelect,
  accept = '*',
  maxSize = '2MB',
  fileTypes = 'jpg, png, or pdf',
  label = 'Upload files',
  className = '',
  disabled = false,
  ...props
}: FileUploadProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (onFileSelect) {
      onFileSelect(files);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className='block text-sm font-medium text-gray-700'>
          {label}
        </label>
      )}
      <div className='border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#7A5AF8] transition-colors cursor-pointer bg-gray-50'>
        <input
          type='file'
          multiple
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          className='hidden'
          id='file-upload'
          {...props}
        />
        <label htmlFor='file-upload' className='cursor-pointer'>
          <Upload size={32} className='mx-auto text-gray-400 mb-2' />
          <p className='text-sm text-gray-600 mb-1'>
            Choose or drag the file here
          </p>
          <p className='text-xs text-gray-500'>
            {fileTypes} max {maxSize}
          </p>
        </label>
      </div>
    </div>
  );
}
