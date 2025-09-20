import React from 'react';
import FileUpload from '../FileUpload';

const BasicInformationStep = ({ formData, setFormData, errors = {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = (file) => {
    setFormData(prev => ({
      ...prev,
      logo: file
    }));
  };

  const inputStyle = `w-full flex items-center gap-[6px] px-4 py-3 rounded-[12px] border border-[#E5E5E5] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.16)] text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-[16px]`;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold font-ibm text-gray-900 mb-2">Basic Information</h2>
      </div>

      <div className="space-y-6">
        {/* Startup Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Startup Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="startupName"
            value={formData.startupName || ''}
            onChange={handleChange}
            placeholder="Enter your startup name here"
            className={`${inputStyle} ${errors.startupName ? 'border-red-500' : ''}`}
            required
          />
          {errors.startupName && (
            <p className="mt-1 text-sm text-red-600">{errors.startupName}</p>
          )}
        </div>

        {/* Startup Logo */}
        <FileUpload
          label="Startup Logo"
          accept=".jpg,.png,.pdf"
          maxSize="2MB"
          description="(.jpg, .png, or .pdf max 2MB)"
          onFileSelect={handleLogoUpload}
          required
        />

        {/* Business Sector and Founded Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business sector <span className="text-red-500">*</span>
            </label>
            <select
              name="sector"
              value={formData.sector || ''}
              onChange={handleChange}
              className={`${inputStyle} ${errors.sector ? 'border-red-500' : ''}`}
              required
            >
              <option value="">Select sector</option>
              <option value="fintech">Fintech</option>
              <option value="healthtech">Healthtech</option>
              <option value="edtech">Edtech</option>
              <option value="ecommerce">E-commerce</option>
              <option value="saas">SaaS</option>
              <option value="ai">Artificial Intelligence</option>
              <option value="blockchain">Blockchain</option>
              <option value="agriculture">Agriculture</option>
              <option value="energy">Clean Energy</option>
              <option value="other">Other</option>
            </select>
            {errors.sector && (
              <p className="mt-1 text-sm text-red-600">{errors.sector}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Founded Year <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="foundedYear"
              value={formData.foundedYear || ''}
              onChange={handleChange}
              placeholder="Enter your startup founded year here"
              className={`${inputStyle} ${errors.foundedYear ? 'border-red-500' : ''}`}
              required
            />
            {errors.foundedYear && (
              <p className="mt-1 text-sm text-red-600">{errors.foundedYear}</p>
            )}
          </div>
        </div>

        {/* Company Type and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company type <span className="text-red-500">*</span>
            </label>
            <select
              name="companyType"
              value={formData.companyType || ''}
              onChange={handleChange}
              className={`${inputStyle} ${errors.companyType ? 'border-red-500' : ''}`}
              required
            >
              <option value="">Select company type</option>
              <option value="corporation">Corporation</option>
              <option value="llc">LLC</option>
              <option value="partnership">Partnership</option>
              <option value="sole_proprietorship">Sole Proprietorship</option>
              <option value="other">Other</option>
            </select>
            {errors.companyType && (
              <p className="mt-1 text-sm text-red-600">{errors.companyType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              placeholder="City, Country"
              className={`${inputStyle} ${errors.location ? 'border-red-500' : ''}`}
              required
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>
        </div>

        {/* Business Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your business in 2-3 sentences"
            className={`${inputStyle} resize-none ${errors.description ? 'border-red-500' : ''}`}
            required
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Website URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </label>
          <input
            type="url"
            name="website"
            value={formData.website || ''}
            onChange={handleChange}
            placeholder="https://your-startup.com"
            className={inputStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformationStep;
