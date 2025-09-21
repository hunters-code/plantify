import React, { useState } from 'react';
import { File, FileUp } from 'lucide-react';

const FileUpload = ({ 
  label, 
  accept, 
  maxSize = "2MB", 
  description,
  onFileSelect,
  required = false,
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
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
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {selectedFile ? (
          <div className="flex flex-col items-center gap-1">
            <File className="w-8 h-8 text-green-500" />
            <div className="text-sm font-medium text-green-700">
              {selectedFile.name}
            </div>
            <div className="text-xs text-green-600">
              File uploaded successfully
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
              <FileUp size={24} />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <div className="text-gray-900 font-medium">
                Choose or drag the file here
              </div>
              <div className="text-sm text-gray-500">
                ({accept} max {maxSize})
              </div>
            </div>
          </div>
        )}
        
        {description && (
          <div className="text-xs text-gray-500 mt-2">
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
