import Image from 'next/image';

import { Award, Medal } from 'lucide-react';

export default function FounderTeam({ startup }) {
  if (!startup) {
    return (
      <div className='space-y-8'>
        <p className='text-gray-500'>Loading team information...</p>
      </div>
    );
  }

  // Handle team members data
  const teamMembers = startup.teamMembers || [];

  // Since we don't have isFounder flag in the data, let's assume the first member is the founder
  // or look for roles containing 'founder', 'ceo', etc.
  const isFounderRole = role => {
    const founderKeywords = [
      'founder',
      'ceo',
      'chief executive',
      'president',
      'director',
    ];
    return founderKeywords.some(keyword =>
      role?.toLowerCase().includes(keyword)
    );
  };

  const founders = teamMembers.filter(member => isFounderRole(member.role));
  const otherMembers = teamMembers.filter(
    member => !isFounderRole(member.role)
  );

  // Extract achievements from startup data if available
  const getAchievements = () => {
    const achievements = [];

    // Try to extract achievements from different possible fields in the startup data
    if (startup.achievements && Array.isArray(startup.achievements)) {
      return startup.achievements.map((achievement, index) => ({
        icon: achievement.icon || getDefaultIcon(index),
        text: achievement.text || achievement,
      }));
    }

    // If there's a founderBackground field, try to extract achievements from i
    if (startup.founderBackground) {
      // Look for bullet points or numbered lists in the tex
      const lines = startup.founderBackground
        .split(/[•\-\*\d+\.\n]/)
        .filter(line => line.trim().length > 0)
        .slice(0, 3); // Take up to 3 achievements

      return lines.map((line, index) => ({
        icon: getDefaultIcon(index),
        text: line.trim(),
      }));
    }

    return achievements;
  };

  const getDefaultIcon = index => {
    const icons = ['🏆', '🎤', '🏅', '🌟', '🚀'];
    return icons[index % icons.length];
  };

  const achievements = getAchievements();

  return (
    <div className='space-y-12'>
      {/* Founder Profile */}

      {/* Key Achievements */}
      {achievements.length > 0 && (
        <div>
          <h2 className='text-2xl font-semibold mb-6'>Key Achievements</h2>
          <div className='space-y-4 bg-white rounded-lg p-6'>
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className='flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm'
              >
                <span className='text-2xl'>{achievement.icon}</span>
                <span>{achievement.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Founder Profiles */}
      {founders.length > 0 && (
        <div>
          <h2 className='text-2xl font-semibold mb-6'>Founder Profile</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {founders.map((member, i) => (
              <div
                key={i}
                className='bg-white rounded-lg overflow-hidden shadow-sm'
              >
                <div className='w-full aspect-square overflow-hidden relative'>
                  <Image
                    src={
                      member.photo && !member.photo.includes('undefined')
                        ? member.photo
                        : '/assets/images/user.png'
                    }
                    alt={member.name}
                    className='object-cover'
                    fill
                    sizes='(max-width: 768px) 100vw, 25vw'
                  />
                </div>
                <div className='p-3'>
                  <h3 className='text-base font-medium'>{member.name}</h3>
                  <p className='text-xs text-gray-500'>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Team Members */}
      {otherMembers.length > 0 && (
        <div className='mt-8'>
          <h2 className='text-2xl font-semibold mb-6'>Team Members</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {otherMembers.map((member, i) => (
              <div
                key={i}
                className='bg-white rounded-lg overflow-hidden shadow-sm'
              >
                <div className='w-full aspect-square overflow-hidden relative'>
                  <Image
                    src={
                      member.photo && !member.photo.includes('undefined')
                        ? member.photo
                        : '/assets/images/user.png'
                    }
                    alt={member.name}
                    className='object-cover'
                    fill
                    sizes='(max-width: 768px) 100vw, 25vw'
                  />
                </div>
                <div className='p-3'>
                  <h3 className='text-base font-medium'>{member.name}</h3>
                  <p className='text-xs text-gray-500'>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information */}
      {(startup.founderBackground || startup.advisors) && (
        <div className='bg-white rounded-lg p-6'>
          <h2 className='text-xl font-semibold mb-4'>Additional Information</h2>
          <div className='space-y-4'>
            {startup.founderBackground && (
              <div className='bg-white rounded-lg p-4 shadow-sm'>
                <h3 className='font-medium flex items-center gap-2 mb-2'>
                  <Award size={18} className='text-amber-500' />
                  Founder Background
                </h3>
                <p className='text-gray-700'>{startup.founderBackground}</p>
              </div>
            )}
            {startup.advisors && (
              <div className='bg-white rounded-lg p-4 shadow-sm'>
                <h3 className='font-medium flex items-center gap-2 mb-2'>
                  <Medal size={18} className='text-blue-500' />
                  Advisors
                </h3>
                <p className='text-gray-700'>{startup.advisors}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
