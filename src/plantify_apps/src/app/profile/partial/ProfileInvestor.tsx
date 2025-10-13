'use client';

import { Edit, Mail, MapPin, Phone, Save, X } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { InvestorService } from '@/services/investors/InvestorService';
import type {
  Investor,
  InvestorProfileUpdateRequest,
} from '@/declarations/plantify_backend/plantify_backend.did';

export default function ProfileInvestor() {
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    occupation: '',
    company: '',
    bio: '',
    profilePhoto: null as string | null,
  });

  // Load investor profile on component mount
  useEffect(() => {
    loadInvestorProfile();
  }, []);

  const loadInvestorProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const profile = await InvestorService.getInvestorProfile();
      if (profile) {
        setInvestor(profile);
        setFormData({
          fullName: profile.fullName || '',
          email: profile.email || '',
          phone: profile.phone || '',
          location: profile.location?.[0] || '',
          occupation: profile.occupation?.[0] || '',
          company: profile.company?.[0] || '',
          bio: profile.bio?.[0] || '',
          profilePhoto: profile.profilePhoto?.[0] || null,
        });
      }
    } catch (err) {
      console.error('Error loading investor profile:', err);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (investor) {
      setFormData({
        fullName: investor.fullName || '',
        email: investor.email || '',
        phone: investor.phone || '',
        location: investor.location?.[0] || '',
        occupation: investor.occupation?.[0] || '',
        company: investor.company?.[0] || '',
        bio: investor.bio?.[0] || '',
        profilePhoto: investor.profilePhoto?.[0] || null,
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const updateRequest: InvestorProfileUpdateRequest = {
        fullName: formData.fullName ? [formData.fullName] : [],
        email: formData.email ? [formData.email] : [],
        phone: formData.phone ? [formData.phone] : [],
        country: [], // Not editable in this form
        city: [], // Not editable in this form
        location: formData.location ? [formData.location] : [],
        occupation: formData.occupation ? [formData.occupation] : [],
        company: formData.company ? [formData.company] : [],
        bio: formData.bio ? [formData.bio] : [],
        profilePhoto: formData.profilePhoto ? [formData.profilePhoto] : [],
        investmentExperience: [], // Not editable in this form
        riskTolerance: [], // Not editable in this form
        investmentGoals: [], // Not editable in this form
        availableCapital: [], // Not editable in this form
        monthlyBudget: [], // Not editable in this form
      };

      const result = await InvestorService.updateInvestorProfile(updateRequest);

      if (result.success && result.investor) {
        setInvestor(result.investor);
        setIsEditing(false);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-gray-500'>Loading profile...</div>
      </div>
    );
  }

  if (!investor) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-red-500'>Failed to load profile</div>
      </div>
    );
  }
  return (
    <div>
      {error && (
        <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700'>
          {error}
        </div>
      )}

      <div className=' mx-auto bg-white shadow-sm rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between'>
        <div className='flex items-center gap-4'>
          <Image
            src={formData.profilePhoto || '/assets/images/profile-default.webp'}
            alt='Profile Photo'
            width={70}
            height={70}
            className='rounded-md'
          />

          <div>
            <h2 className='text-xl font-semibold text-gray-900'>
              {isEditing ? (
                <input
                  type='text'
                  value={formData.fullName}
                  onChange={e => handleInputChange('fullName', e.target.value)}
                  className='border border-gray-300 rounded px-2 py-1 text-xl font-semibold'
                />
              ) : (
                investor.fullName
              )}
            </h2>
            <p className='text-gray-500 text-sm'>
              {investor.availableCapital} available capital
            </p>

            <div className='flex flex-wrap gap-2 mt-2 text-sm text-gray-600'>
              <span className='flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full'>
                <MapPin size={16} className='text-gray-500' />
                {isEditing ? (
                  <input
                    type='text'
                    value={formData.location}
                    onChange={e =>
                      handleInputChange('location', e.target.value)
                    }
                    className='border border-gray-300 rounded px-1 py-0.5 text-sm'
                    placeholder='Location'
                  />
                ) : (
                  investor.location || 'Not specified'
                )}
              </span>
              <span className='flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full'>
                <Mail size={16} className='text-gray-500' />
                {isEditing ? (
                  <input
                    type='email'
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    className='border border-gray-300 rounded px-1 py-0.5 text-sm'
                    placeholder='Email'
                  />
                ) : (
                  investor.email
                )}
              </span>
              <span className='flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full'>
                <Phone size={16} className='text-gray-500' />
                {isEditing ? (
                  <input
                    type='text'
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    className='border border-gray-300 rounded px-1 py-0.5 text-sm'
                    placeholder='Phone'
                  />
                ) : (
                  investor.phone
                )}
              </span>
            </div>
          </div>
        </div>

        <div className='flex gap-2'>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className='flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow-sm hover:bg-green-700 transition disabled:opacity-50'
              >
                <Save size={18} />
                <span className='text-sm font-medium'>
                  {isSaving ? 'Saving...' : 'Save'}
                </span>
              </button>
              <button
                onClick={handleCancel}
                className='flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-xl shadow-sm hover:bg-gray-700 transition'
              >
                <X size={18} />
                <span className='text-sm font-medium'>Cancel</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className='flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition'
            >
              <Edit size={18} className='text-gray-700' />
              <span className='text-sm font-medium text-gray-800'>
                Edit Profile
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Personal Information Section */}
      <div className=' mx-auto bg-white mt-8 rounded-2xl shadow-sm p-6'>
        <h3 className='text-2xl font-semibold text-gray-900 mb-6'>
          Personal Information
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm text-gray-500 mb-1'>
              Full Name
            </label>
            {isEditing ? (
              <input
                type='text'
                value={formData.fullName}
                onChange={e => handleInputChange('fullName', e.target.value)}
                className='w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm text-sm'
              />
            ) : (
              <input
                type='text'
                value={investor.fullName}
                readOnly
                className='w-full rounded-xl border border-gray-200 px-4 py-2 bg-gray-50 shadow-sm text-sm'
              />
            )}
          </div>

          <div>
            <label className='block text-sm text-gray-500 mb-1'>Location</label>
            {isEditing ? (
              <input
                type='text'
                value={formData.location}
                onChange={e => handleInputChange('location', e.target.value)}
                className='w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm text-sm'
              />
            ) : (
              <input
                type='text'
                value={investor.location || 'Not specified'}
                readOnly
                className='w-full rounded-xl border border-gray-200 px-4 py-2 bg-gray-50 shadow-sm text-sm'
              />
            )}
          </div>

          <div>
            <label className='block text-sm text-gray-500 mb-1'>
              Email Address
            </label>
            {isEditing ? (
              <input
                type='email'
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                className='w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm text-sm'
              />
            ) : (
              <input
                type='email'
                value={investor.email}
                readOnly
                className='w-full rounded-xl border border-gray-200 px-4 py-2 bg-gray-50 shadow-sm text-sm'
              />
            )}
          </div>

          <div>
            <label className='block text-sm text-gray-500 mb-1'>
              Occupation
            </label>
            {isEditing ? (
              <input
                type='text'
                value={formData.occupation}
                onChange={e => handleInputChange('occupation', e.target.value)}
                className='w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm text-sm'
              />
            ) : (
              <input
                type='text'
                value={investor.occupation || 'Not specified'}
                readOnly
                className='w-full rounded-xl border border-gray-200 px-4 py-2 bg-gray-50 shadow-sm text-sm'
              />
            )}
          </div>

          <div>
            <label className='block text-sm text-gray-500 mb-1'>
              Phone Number
            </label>
            {isEditing ? (
              <input
                type='text'
                value={formData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                className='w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm text-sm'
              />
            ) : (
              <input
                type='text'
                value={investor.phone}
                readOnly
                className='w-full rounded-xl border border-gray-200 px-4 py-2 bg-gray-50 shadow-sm text-sm'
              />
            )}
          </div>

          <div>
            <label className='block text-sm text-gray-500 mb-1'>Company</label>
            {isEditing ? (
              <input
                type='text'
                value={formData.company}
                onChange={e => handleInputChange('company', e.target.value)}
                className='w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm text-sm'
              />
            ) : (
              <input
                type='text'
                value={investor.company || 'Not specified'}
                readOnly
                className='w-full rounded-xl border border-gray-200 px-4 py-2 bg-gray-50 shadow-sm text-sm'
              />
            )}
          </div>
        </div>

        <div className='mt-6'>
          <label className='block text-sm text-gray-500 mb-1'>Bio</label>
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={e => handleInputChange('bio', e.target.value)}
              rows={3}
              className='w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm text-sm'
              placeholder='Tell us about yourself...'
            />
          ) : (
            <textarea
              value={investor.bio || 'No bio available'}
              readOnly
              rows={3}
              className='w-full rounded-xl border border-gray-200 px-4 py-2 bg-gray-50 shadow-sm text-sm'
            />
          )}
        </div>
      </div>
    </div>
  );
}
