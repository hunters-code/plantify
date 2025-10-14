'use client';

import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { Input, Textarea, Button } from '@/components/ui';
import FileUpload from '@/components/ui/FileUpload';
import { JOB_ROLE_OPTIONS } from '@/constants/jobRoles';

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
  const [teamMemberPhotos, setTeamMemberPhotos] = useState<{
    [key: number]: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(name, value);
  };

  const handleFounderPhotoUpload = (files: File[]) => {
    if (files && files.length > 0) {
      const file = files[0];

      // Create a local preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);

      // Set the file in form data
      setFormData('founderPhoto', file);
      setFormData('founderPhotoUrl', previewUrl); // Store preview URL temporarily

      console.log('DEBUG: Storing founder photo locally:', {
        fileName: file.name,
        fileSize: file.size,
        previewUrl,
      });
    }
  };

  const handleTeamMemberChange = (
    index: number,
    field: string,
    value: string | File
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
        photoUrl: '',
        isFounder: false,
      };
    }
    (updatedTeamMembers[index] as any)[field] = value;

    setFormData('teamMembers', updatedTeamMembers);
  };

  const handleTeamMemberPhotoUpload = (index: number, files: File[]) => {
    if (files && files.length > 0) {
      const file = files[0];

      // Create a local preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);

      // Store photo URL in local state for preview
      setTeamMemberPhotos(prev => ({
        ...prev,
        [index]: previewUrl,
      }));

      // Update team member data with the file (no upload yet)
      const updatedTeamMembers = [...(formData.teamMembers || [])];
      if (!updatedTeamMembers[index]) {
        updatedTeamMembers[index] = {
          name: '',
          role: '',
          email: '',
          linkedin: '',
          background: '',
          photo: null,
          photoUrl: '',
          isFounder: false,
        };
      }
      updatedTeamMembers[index].photo = file;
      updatedTeamMembers[index].photoUrl = previewUrl; // Store preview URL temporarily

      console.log(`DEBUG: Storing photo locally for team member ${index}:`, {
        index,
        fileName: file.name,
        fileSize: file.size,
        previewUrl,
        teamMembersAfter: updatedTeamMembers.map((m, i) => ({
          index: i,
          name: m.name,
          hasPhoto: !!m.photo,
        })),
      });

      setFormData('teamMembers', updatedTeamMembers);
    }
  };

  const addTeamMember = () => {
    const newTeamMembers = [
      ...(formData.teamMembers || []),
      {
        name: '',
        role: '',
        email: '',
        linkedin: '',
        background: '',
        photo: null,
        photoUrl: '',
        isFounder: false,
      },
    ];
    setFormData('teamMembers', newTeamMembers);
  };

  const removeTeamMember = (index: number) => {
    const updatedTeamMembers = formData.teamMembers.filter(
      (_, i) => i !== index
    );
    setFormData('teamMembers', updatedTeamMembers);

    // Clean up local photo state
    setTeamMemberPhotos(prev => {
      const newPhotos = { ...prev };
      delete newPhotos[index];
      // Shift remaining photos down
      const shiftedPhotos: { [key: number]: string } = {};
      Object.keys(newPhotos).forEach(key => {
        const oldIndex = parseInt(key);
        if (oldIndex > index) {
          shiftedPhotos[oldIndex - 1] = newPhotos[oldIndex];
        } else if (oldIndex < index) {
          shiftedPhotos[oldIndex] = newPhotos[oldIndex];
        }
      });
      return shiftedPhotos;
    });
  };

  return (
    <div className='space-y-8'>
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold font-ibm text-gray-900 mb-2'>
          Team & Background
        </h2>
      </div>

      {/* Founder Section */}
      <div className='bg-gray-50 rounded-lg p-6'>
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
            <FileUpload
              label='Profile photo'
              accept='.jpg,.png,.pdf'
              maxSize='2MB'
              fileTypes='jpg, png, or pdf'
              onFileSelect={handleFounderPhotoUpload}
            />

            {formData.founderPhotoUrl && (
              <div className='mt-2'>
                <p className='text-sm font-medium text-gray-700 mb-1'>
                  Preview:
                </p>
                <div className='flex items-center space-x-2'>
                  <div className='h-16 w-16 rounded-md overflow-hidden border border-gray-200'>
                    <img
                      src={formData.founderPhotoUrl}
                      alt='Founder Photo Preview'
                      className='h-full w-full object-cover'
                    />
                  </div>
                  <div className='text-sm text-green-600 flex items-center'>
                    <svg
                      className='w-4 h-4 mr-1'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    Uploaded successfully
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div className='space-y-6'>
        {formData.teamMembers &&
          formData.teamMembers.map((member, index) => (
            <div key={index} className='bg-gray-50 rounded-lg p-6 relative'>
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
                  <FileUpload
                    label='Profile photo'
                    accept='.jpg,.png,.pdf'
                    maxSize='2MB'
                    fileTypes='jpg, png, or pdf'
                    onFileSelect={files =>
                      handleTeamMemberPhotoUpload(index, files)
                    }
                  />

                  {(teamMemberPhotos[index] || member.photoUrl) && (
                    <div className='mt-2'>
                      <p className='text-sm font-medium text-gray-700 mb-1'>
                        Preview:
                      </p>
                      <div className='flex items-center space-x-2'>
                        <div className='h-16 w-16 rounded-md overflow-hidden border border-gray-200'>
                          <img
                            src={teamMemberPhotos[index] || member.photoUrl}
                            alt='Team Member Photo Preview'
                            className='h-full w-full object-cover'
                            onLoad={() =>
                              console.log(
                                `DEBUG: Image loaded for team member ${index}:`,
                                teamMemberPhotos[index] || member.photoUrl
                              )
                            }
                            onError={() =>
                              console.log(
                                `DEBUG: Image failed to load for team member ${index}:`,
                                teamMemberPhotos[index] || member.photoUrl
                              )
                            }
                          />
                        </div>
                        <div className='text-sm text-green-600 flex items-center'>
                          <svg
                            className='w-4 h-4 mr-1'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M5 13l4 4L19 7'
                            />
                          </svg>
                          Uploaded successfully
                        </div>
                      </div>
                    </div>
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
