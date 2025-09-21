import React from 'react';
import FileUpload from '../FileUpload';
import { Input, Textarea, Button } from '../../../components/ui';

const TeamBackgroundStep = ({ formData, setFormData, errors = {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


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
            <Input
              type="text"
              name="founderName"
              label="Full name"
              value={formData.founderName || ''}
              onChange={handleChange}
              placeholder="Insert founder full name here"
              required
              error={errors.founderName}
            />

            <Input
              type="text"
              name="founderRole"
              label="Role"
              value={formData.founderRole || ''}
              onChange={handleChange}
              placeholder="CEO, CTO, CFO, etc."
              required
              error={errors.founderRole}
            />
          </div>

          {/* Founder Email and LinkedIn */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="email"
              name="founderEmail"
              label="Email"
              value={formData.founderEmail || ''}
              onChange={handleChange}
              placeholder="Insert founder email here"
              required
              error={errors.founderEmail}
            />

            <Input
              type="url"
              name="founderLinkedIn"
              label="LinkedIn profile"
              value={formData.founderLinkedIn || ''}
              onChange={handleChange}
              placeholder="Insert founder LinkedIn profile here"
              required
              error={errors.founderLinkedIn}
            />
          </div>

          {/* Professional Background */}
          <Textarea
            name="founderBackground"
            label="Professional background"
            value={formData.founderBackground || ''}
            onChange={handleChange}
            rows={4}
            placeholder="Describe professional experience, education, achievements, and relevant skills"
            required
            error={errors.founderBackground}
          />

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
                <Input
                  type="text"
                  label="Full name"
                  value={member.name || ''}
                  onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                  placeholder="Insert team member 1 full name here"
                  required
                />

                <Input
                  type="text"
                  label="Role"
                  value={member.role || ''}
                  onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                  placeholder="CEO, CTO, CFO, etc."
                  required
                />
              </div>

              {/* Team Member Email and LinkedIn */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="email"
                  label="Email"
                  value={member.email || ''}
                  onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                  placeholder="Insert team member 1 email here"
                  required
                />

                <Input
                  type="url"
                  label="LinkedIn profile"
                  value={member.linkedIn || ''}
                  onChange={(e) => handleTeamMemberChange(index, 'linkedIn', e.target.value)}
                  placeholder="Insert team member 1 LinkedIn profile here"
                  required
                />
              </div>

              {/* Professional Background */}
              <Textarea
                label="Professional background"
                value={member.background || ''}
                onChange={(e) => handleTeamMemberChange(index, 'background', e.target.value)}
                rows={4}
                placeholder="Describe professional experience, education, achievements, and relevant skills"
                required
              />

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
        <Button
          type="button"
          onClick={addTeamMember}
          variant='outline'
          className="w-full flex items-center justify-center border-2 border-dashed border-blue-300 text-blue-600 hover:border-blue-400 hover:bg-blue-50"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add team member
        </Button>
      </div>

      {/* Advisors & Mentors */}
      <Textarea
        name="advisors"
        label="Advisors & mentors"
        value={formData.advisors || ''}
        onChange={handleChange}
        rows={4}
        placeholder="List any advisors, mentors, or industry experts supporting your startup"
        required
        error={errors.advisors}
      />
    </div>
  );
};

export default TeamBackgroundStep;
