import React from 'react';
import FileUpload from '../FileUpload';

const TeamBackgroundStep = ({ formData, setFormData, errors = {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const inputStyle = `w-full flex items-center gap-[6px] px-4 py-3 rounded-[12px] border border-[#E5E5E5] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.16)] text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-[16px]`;

  const handleFounderPhotoUpload = (file) => {
    setFormData(prev => ({
      ...prev,
      founderPhoto: file
    }));
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedTeamMembers = [...(formData.teamMembers || [])];
    if (!updatedTeamMembers[index]) {
      updatedTeamMembers[index] = {};
    }
    updatedTeamMembers[index][field] = value;
    
    setFormData(prev => ({
      ...prev,
      teamMembers: updatedTeamMembers
    }));
  };

  const handleTeamMemberPhotoUpload = (index, file) => {
    handleTeamMemberChange(index, 'photo', file);
  };

  const addTeamMember = () => {
    const newTeamMembers = [...(formData.teamMembers || []), {}];
    setFormData(prev => ({
      ...prev,
      teamMembers: newTeamMembers
    }));
  };

  const removeTeamMember = (index) => {
    const updatedTeamMembers = formData.teamMembers.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      teamMembers: updatedTeamMembers
    }));
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold font-ibm text-gray-900 mb-2">Team & Background</h2>
      </div>

      {/* Founder Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Founder</h3>
        
        <div className="space-y-6">
          {/* Founder Name and Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="founderName"
                value={formData.founderName || ''}
                onChange={handleChange}
                placeholder="Insert founder full name here"
                className={`${inputStyle} ${errors.founderName ? 'border-red-500' : ''}`}
                required
              />
              {errors.founderName && (
                <p className="mt-1 text-sm text-red-600">{errors.founderName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="founderRole"
                value={formData.founderRole || ''}
                onChange={handleChange}
                placeholder="CEO, CTO, CFO, etc."
                className={`${inputStyle} ${errors.founderRole ? 'border-red-500' : ''}`}
                required
              />
              {errors.founderRole && (
                <p className="mt-1 text-sm text-red-600">{errors.founderRole}</p>
              )}
            </div>
          </div>

          {/* Founder Email and LinkedIn */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="founderEmail"
                value={formData.founderEmail || ''}
                onChange={handleChange}
                placeholder="Insert founder email here"
                className={`${inputStyle} ${errors.founderEmail ? 'border-red-500' : ''}`}
                required
              />
              {errors.founderEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.founderEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn profile <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="founderLinkedIn"
                value={formData.founderLinkedIn || ''}
                onChange={handleChange}
                placeholder="Insert founder LinkedIn profile here"
                className={`${inputStyle} ${errors.founderLinkedIn ? 'border-red-500' : ''}`}
                required
              />
              {errors.founderLinkedIn && (
                <p className="mt-1 text-sm text-red-600">{errors.founderLinkedIn}</p>
              )}
            </div>
          </div>

          {/* Professional Background */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional background <span className="text-red-500">*</span>
            </label>
            <textarea
              name="founderBackground"
              value={formData.founderBackground || ''}
              onChange={handleChange}
              rows={4}
              placeholder="Describe professional experience, education, achievements, and relevant skills"
              className={`${inputStyle} resize-none ${errors.founderBackground ? 'border-red-500' : ''}`}
              required
            />
            {errors.founderBackground && (
              <p className="mt-1 text-sm text-red-600">{errors.founderBackground}</p>
            )}
          </div>

          {/* Profile Photo */}
          <FileUpload
            label="Profile photo"
            accept=".jpg,.png,.pdf"
            maxSize="2MB"
            description="(.jpg, .png, or .pdf max 2MB)"
            onFileSelect={handleFounderPhotoUpload}
            required
          />
        </div>
      </div>

      {/* Team Members Section */}
      <div className="space-y-6">
        {formData.teamMembers && formData.teamMembers.map((member, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Team member {index + 1}</h3>
              <button
                type="button"
                onClick={() => removeTeamMember(index)}
                className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>

            <div className="space-y-6">
              {/* Team Member Name and Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={member.name || ''}
                    onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                    placeholder="Insert team member 1 full name here"
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={member.role || ''}
                    onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                    placeholder="CEO, CTO, CFO, etc."
                    className={inputStyle}
                    required
                  />
                </div>
              </div>

              {/* Team Member Email and LinkedIn */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={member.email || ''}
                    onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                    placeholder="Insert team member 1 email here"
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn profile <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={member.linkedIn || ''}
                    onChange={(e) => handleTeamMemberChange(index, 'linkedIn', e.target.value)}
                    placeholder="Insert team member 1 LinkedIn profile here"
                    className={inputStyle}
                    required
                  />
                </div>
              </div>

              {/* Professional Background */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional background <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={member.background || ''}
                  onChange={(e) => handleTeamMemberChange(index, 'background', e.target.value)}
                  rows={4}
                  placeholder="Describe professional experience, education, achievements, and relevant skills"
                  className={`${inputStyle} resize-none`}
                  required
                />
              </div>

              {/* Profile Photo */}
              <FileUpload
                label="Profile photo"
                accept=".jpg,.png,.pdf"
                maxSize="2MB"
                description="(.jpg, .png, or .pdf max 2MB)"
                onFileSelect={(file) => handleTeamMemberPhotoUpload(index, file)}
                required
              />
            </div>
          </div>
        ))}

        {/* Add Team Member Button */}
        <button
          type="button"
          onClick={addTeamMember}
          className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add team member
        </button>
      </div>

      {/* Advisors & Mentors */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Advisors & mentors <span className="text-red-500">*</span>
        </label>
        <textarea
          name="advisors"
          value={formData.advisors || ''}
          onChange={handleChange}
          rows={4}
          placeholder="List any advisors, mentors, or industry experts supporting your startup"
          className={`${inputStyle} resize-none ${errors.advisors ? 'border-red-500' : ''}`}
          required
        />
        {errors.advisors && (
          <p className="mt-1 text-sm text-red-600">{errors.advisors}</p>
        )}
      </div>
    </div>
  );
};

export default TeamBackgroundStep;
