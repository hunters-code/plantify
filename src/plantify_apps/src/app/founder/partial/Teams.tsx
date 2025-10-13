'use client';

import { Plus, MoreHorizontal, User } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

import { Button, Card } from '@/components/ui';
import type {
  TeamMember,
  Startup,
} from '@/declarations/plantify_backend/plantify_backend.did';
import { StartupService } from '@/services/marketplace/StartupService';

export default function TeamSection({ startupId }: { startupId: string }) {
  const [startup, setStartup] = useState<Startup | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch startup details and team members
  useEffect(() => {
    const fetchStartupData = async () => {
      if (!startupId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const startupData = await StartupService.getStartupDetails(startupId);
        if (startupData) {
          setStartup(startupData);
          setTeamMembers(startupData.teamMembers || []);
        } else {
          setError('Startup not found');
        }
      } catch (err) {
        console.error('Error fetching startup data:', err);
        setError('Failed to load startup data');
      } finally {
        setLoading(false);
      }
    };

    fetchStartupData();
  }, [startupId]);

  if (loading) {
    return (
      <div className='bg-neutral-100 rounded-[16px] p-6'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-300 rounded mb-6 w-1/3'></div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
            {[1, 2, 3].map(i => (
              <div key={i} className='bg-white rounded-lg overflow-hidden'>
                <div className='h-[370px] bg-gray-300 m-2 rounded-xl'></div>
                <div className='p-4'>
                  <div className='h-4 bg-gray-300 rounded mb-2'></div>
                  <div className='h-3 bg-gray-300 rounded w-2/3'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-[16px] p-6'>
        <div className='text-red-600'>
          <h2 className='text-2xl font-semibold mb-2'>Error Loading Team</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!startupId) {
    return (
      <div className='bg-neutral-100 rounded-[16px] p-6'>
        <div className='text-center py-8'>
          <h2 className='text-2xl font-semibold mb-2'>No Startup Selected</h2>
          <p className='text-gray-500'>
            Please select a startup from the dropdown above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-neutral-100 rounded-[16px] p-6'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-semibold text-gray-900 font-ibm'>
          {startup?.startupName || 'Startup'} Team
        </h2>
        <Button variant='secondary' className='flex items-center gap-2'>
          <Plus size={16} />
          Add new member
        </Button>
      </div>

      {/* Team Grid */}
      {teamMembers.length === 0 ? (
        <div className='text-center py-12'>
          <User size={48} className='mx-auto text-gray-400 mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            No Team Members
          </h3>
          <p className='text-gray-500 mb-4'>
            This startup doesn&apos;t have any team members yet.
          </p>
          <Button variant='primary' className='flex items-center gap-2 mx-auto'>
            <Plus size={16} />
            Add First Team Member
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {teamMembers.map(member => {
            // Helper function to get photo URL from backend format
            const getPhotoUrl = (photo: [] | [string]) => {
              if (Array.isArray(photo) && photo.length > 0) {
                return photo[0];
              }
              return null;
            };

            const photoUrl = getPhotoUrl(member.photo);

            return (
              <Card key={member.id.toString()} className='overflow-hidden'>
                <div className='p-2'>
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={member.name}
                      width={300}
                      height={370}
                      className='w-full h-[370px] object-cover rounded-xl'
                    />
                  ) : (
                    <div className='w-full h-[370px] bg-gray-200 rounded-xl flex items-center justify-center'>
                      <User size={64} className='text-gray-400' />
                    </div>
                  )}
                </div>
                <div className='flex items-center justify-between p-4'>
                  <div className='flex-1'>
                    <p className='text-gray-900 font-medium text-[16px]'>
                      {member.name}
                    </p>
                    <p className='text-gray-500 text-sm'>{member.role}</p>
                    {member.isFounder && (
                      <span className='inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1'>
                        Founder
                      </span>
                    )}
                    {member.email && (
                      <p className='text-gray-400 text-xs mt-1'>
                        {member.email}
                      </p>
                    )}
                  </div>
                  <Button variant='secondary' className='p-3'>
                    <MoreHorizontal size={18} className='text-gray-600' />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
// Test comment
