'use client';

import { Trash2, Loader2, X } from 'lucide-react';
import React, { useState } from 'react';

import { Input, Textarea, Button } from '@/components/ui';
import FileUpload from '@/components/ui/FileUpload';
import { JOB_ROLE_OPTIONS } from '@/constants/jobRoles';
import { uploadFile } from '@/lib/fileUpload';

import { StartupFormData } from '../types';

interface TeamBackgroundStepProps {
  formData: StartupFormData;
  setFormData: (
    field: string,
    value: string | File | null | Array<any>,
    shouldValidate?: boolean
  ) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

const TeamBackgroundStep: React.FC<TeamBackgroundStepProps> = ({
  formData,
  setFormData,
  errors = {},
  touched = {},
}) => {
  const [isUploadingFounder, setIsUploadingFounder] = useState(false);
  const [isUploadingTeamMember, setIsUploadingTeamMember] = useState<
    number | null
  >(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(name, value);
  };

  const handleFounderPhotoUpload = async (files: File[]) => {
    if (files && files.length > 0) {
      const file = files[0];

      // Set the file in form data
      setFormData('founderPhoto', file);

      // Upload the file and get the preview URL
      setIsUploadingFounder(true);
      try {
        const fileUrl = await uploadFile(
          file,
          'plantify-uploads',
          'founderPhoto'
        );

        if (fileUrl) {
          // Store the URL in the form data
          setFormData('founderPhotoUrl', fileUrl);
        } else {
          console.error('Failed to upload founder photo');
        }
      } catch (error) {
        console.error('Error uploading founder photo:', error);
      } finally {
        setIsUploadingFounder(false);
      }
    }
  };

  const handleRemoveFounderPhoto = () => {
    setFormData('founderPhoto', null);
    setFormData('founderPhotoUrl', '');
  };

  const handleTeamMemberChange = (
    index: number,
    field: string,
    value: string | File | null
  ) => {
    const updatedTeamMembers = [...(formData.teamMembers || [])];
    if (!updatedTeamMembers[index]) {
      updatedTeamMembers[index] = {
        name: '',
        role: '',
        email: '',
        linkedin: '',
        background: '',
        photo: null,
        isFounder: false,
      };
    }
    (updatedTeamMembers[index] as any)[field] = value;

    setFormData('teamMembers', updatedTeamMembers);
  };

  const handleTeamMemberPhotoUpload = async (index: number, files: File[]) => {
    if (files && files.length > 0) {
      const file = files[0];

      // Set the file in team member data
      handleTeamMemberChange(index, 'photo', file);

      // Upload the file and get the preview URL
      setIsUploadingTeamMember(index);
      try {
        const fileUrl = await uploadFile(file, 'plantify-uploads', 'teamPhoto');

        if (fileUrl) {
          // Store the URL in the team member data
          handleTeamMemberChange(index, 'photoUrl', fileUrl);

          // Also store in the array of team member photo URLs
          // Create a new array with the correct length to ensure we're not overwriting other photos
          const currentUrls = formData.teamMemberPhotosUrls || [];
          const updatedUrls = [...currentUrls];

          // Make sure the array has enough elements to accommodate the current index
          while (updatedUrls.length <= index) {
            updatedUrls.push(null);
          }

          // Set the URL at the correct index
          updatedUrls[index] = fileUrl;

          setFormData('teamMemberPhotosUrls', updatedUrls);
        } else {
          console.error(`Failed to upload team member ${index} photo`);
        }
      } catch (error) {
        console.error(`Error uploading team member ${index} photo:`, error);
      } finally {
        setIsUploadingTeamMember(null);
      }
    }
  };

  const handleRemoveTeamMemberPhoto = (index: number) => {
    // Remove photo from team member data
    handleTeamMemberChange(index, 'photo', null);
    handleTeamMemberChange(index, 'photoUrl', '');

    // Also update the teamMemberPhotosUrls array
    if (
      formData.teamMemberPhotosUrls &&
      formData.teamMemberPhotosUrls.length > index
    ) {
      const updatedUrls = [...formData.teamMemberPhotosUrls];
      updatedUrls[index] = null;
      setFormData('teamMemberPhotosUrls', updatedUrls);
    }
  };

  const addTeamMember = () => {
    const newTeamMember = {
      name: '',
      role: '',
      email: '',
      linkedin: '',
      background: '',
      photo: null,
      isFounder: false,
    };
    const newTeamMembers = [...(formData.teamMembers || []), newTeamMember];
    setFormData('teamMembers', newTeamMembers);
  };

  const removeTeamMember = (index: number) => {
    // Remove team member from teamMembers array
    const updatedTeamMembers = formData.teamMembers.filter(
      (_, i) => i !== index
    );
    setFormData('teamMembers', updatedTeamMembers);

    // Also update the teamMemberPhotosUrls array to remove the corresponding photo URL
    if (
      formData.teamMemberPhotosUrls &&
      formData.teamMemberPhotosUrls.length > index
    ) {
      const updatedUrls = [...formData.teamMemberPhotosUrls];
      updatedUrls.splice(index, 1); // Remove the URL at the specified index
      setFormData('teamMemberPhotosUrls', updatedUrls);
    }
  };

  return (
    <div className='space-y-8'>
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold font-ibm text-gray-900 mb-2'>
          Team & Background
        </h2>
      </div>

      {/* Founder Section */}
      <div className='bg-white rounded-lg p-6'>
        <h3 className='text-xl font-semibold text-gray-900 mb-6'>Founder</h3>

        <div className='space-y-6'>
          {/* Founder Name and Role */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Input
              type='text'
              name='founderName'
              label='Full name'
              value={formData.founderName || ''}
              onChange={handleChange}
              placeholder='Insert founder full name here'
              required
              error={errors.founderName}
            />

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Role <span className='text-red-500'>*</span>
              </label>
              <select
                name='founderRole'
                value={formData.founderRole || ''}
                onChange={handleChange}
                className={`w-full flex items-center gap-[6px] px-4 py-3 rounded-[12px] border border-[#E5E5E5] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.16)] text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-[16px] ${errors.founderRole ? 'border-red-500' : ''}`}
                required
              >
                <option value=''>Select role</option>
                {JOB_ROLE_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.founderRole && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.founderRole}
                </p>
              )}
            </div>
          </div>

          {/* Founder Email and LinkedIn */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Input
              type='email'
              name='founderEmail'
              label='Email'
              value={formData.founderEmail || ''}
              onChange={handleChange}
              placeholder='Insert founder email here'
              required
              error={errors.founderEmail}
            />

            <Input
              type='url'
              name='founderLinkedIn'
              label='LinkedIn profile'
              value={formData.founderLinkedIn || ''}
              onChange={handleChange}
              placeholder='Insert founder LinkedIn profile here'
              required
              error={errors.founderLinkedIn}
            />
          </div>

          {/* Professional Background */}
          <Textarea
            name='founderBackground'
            label='Professional background'
            value={formData.founderBackground || ''}
            onChange={handleChange}
            rows={4}
            placeholder='Describe professional experience, education, achievements, and relevant skills'
            required
            error={errors.founderBackground}
          />

          {/* Profile Photo */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Profile photo <span className='text-red-500'>*</span>
            </label>

            {isUploadingFounder && (
              <div className='flex items-center space-x-2 text-blue-600 mt-2'>
                <Loader2 size={16} className='animate-spin' />
                <span className='text-sm'>Uploading photo...</span>
              </div>
            )}

            {formData.founderPhotoUrl && !isUploadingFounder ? (
              <div className='relative inline-block'>
                <div className='h-32 w-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm'>
                  <img
                    src={formData.founderPhotoUrl}
                    alt='Founder Photo Preview'
                    className='h-full w-full object-cover'
                  />
                </div>
                <button
                  type='button'
                  onClick={handleRemoveFounderPhoto}
                  className='absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors duration-200'
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              !isUploadingFounder && (
                <FileUpload
                  accept='.jpg,.png,.pdf'
                  maxSize='2MB'
                  fileTypes='jpg, png, or pdf'
                  onFileSelect={handleFounderPhotoUpload}
                  disabled={isUploadingFounder}
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div className='space-y-6'>
        {formData.teamMembers &&
          formData.teamMembers.map((member, index) => (
            <div key={index} className='bg-white rounded-lg p-6 relative'>
              <div className='flex justify-between items-center mb-6'>
                <h3 className='text-xl font-semibold text-gray-900'>
                  Team member {index + 1}
                </h3>
                <button
                  type='button'
                  onClick={() => removeTeamMember(index)}
                  className='flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200'
                >
                  <Trash2 className='w-4 h-4 mr-1' />
                  Delete
                </button>
              </div>

              <div className='space-y-6'>
                {/* Team Member Name and Role */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <Input
                    type='text'
                    label='Full name'
                    value={member.name || ''}
                    onChange={e =>
                      handleTeamMemberChange(index, 'name', e.target.value)
                    }
                    placeholder='Insert team member full name here'
                    required
                  />

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Role <span className='text-red-500'>*</span>
                    </label>
                    <select
                      value={member.role || ''}
                      onChange={e =>
                        handleTeamMemberChange(index, 'role', e.target.value)
                      }
                      className='w-full flex items-center gap-[6px] px-4 py-3 rounded-[12px] border border-[#E5E5E5] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.16)] text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-[16px]'
                      required
                    >
                      <option value=''>Select role</option>
                      {JOB_ROLE_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Team Member Email and LinkedIn */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <Input
                    type='email'
                    label='Email'
                    value={member.email || ''}
                    onChange={e =>
                      handleTeamMemberChange(index, 'email', e.target.value)
                    }
                    placeholder='Insert team member email here'
                    required
                  />

                  <Input
                    type='url'
                    label='LinkedIn profile'
                    value={member.linkedin || ''}
                    onChange={e =>
                      handleTeamMemberChange(index, 'linkedin', e.target.value)
                    }
                    placeholder='Insert team member LinkedIn profile here'
                    required
                  />
                </div>

                {/* Professional Background */}
                <Textarea
                  label='Professional background'
                  value={member.background || ''}
                  onChange={e =>
                    handleTeamMemberChange(index, 'background', e.target.value)
                  }
                  rows={4}
                  placeholder='Describe professional experience, education, achievements, and relevant skills'
                  required
                />

                {/* Profile Photo */}
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Profile photo <span className='text-red-500'>*</span>
                  </label>

                  {isUploadingTeamMember === index && (
                    <div className='flex items-center space-x-2 text-blue-600 mt-2'>
                      <Loader2 size={16} className='animate-spin' />
                      <span className='text-sm'>Uploading photo...</span>
                    </div>
                  )}

                  {member.photoUrl && isUploadingTeamMember !== index ? (
                    <div className='relative inline-block'>
                      <div className='h-32 w-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm'>
                        <img
                          src={member.photoUrl}
                          alt='Team Member Photo Preview'
                          className='h-full w-full object-cover'
                        />
                      </div>
                      <button
                        type='button'
                        onClick={() => handleRemoveTeamMemberPhoto(index)}
                        className='absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors duration-200'
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    isUploadingTeamMember !== index && (
                      <FileUpload
                        accept='.jpg,.png,.pdf'
                        maxSize='2MB'
                        fileTypes='jpg, png, or pdf'
                        onFileSelect={files =>
                          handleTeamMemberPhotoUpload(index, files)
                        }
                        disabled={isUploadingTeamMember === index}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          ))}

        {/* Add Team Member Button */}
        <Button
          onClick={addTeamMember}
          variant='secondary'
          className='w-full flex items-center justify-center border-2 border-dashed border-blue-300 text-blue-600 hover:border-blue-400 hover:bg-blue-50'
        >
          <svg
            className='w-5 h-5 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 6v6m0 0v6m0-6h6m-6 0H6'
            />
          </svg>
          Add team member
        </Button>
      </div>

      {/* Advisors & Mentors */}
      <Textarea
        name='advisors'
        label='Advisors & mentors'
        value={formData.advisors || ''}
        onChange={handleChange}
        rows={4}
        placeholder='List any advisors, mentors, or industry experts supporting your startup'
        required
        error={errors.advisors}
      />
    </div>
  );
};

export default TeamBackgroundStep;
