import { Award, Mail, Linkedin } from 'lucide-react';

export default function FounderTeam({ startup }) {
  if (!startup) {
    return (
      <div className='space-y-8'>
        <p className='text-gray-500'>Loading team information...</p>
      </div>
    );
  }

  const teamMembers = startup.teamMembers || [];
  const founders = teamMembers.filter(member => member.isFounder);
  const otherMembers = teamMembers.filter(member => !member.isFounder);

  return (
    <div className='space-y-8'>
      {/* Founder Profile */}
      <div>
        <h2 className='text-2xl font-semibold font-ibm'>Founder Profile</h2>
        {founders.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4'>
            {founders.map((founder, i) => (
              <div
                key={founder.id || i}
                className='bg-neutral-100 border border-500 rounded-2xl shadow-sm overflow-hidden'
              >
                <div className='px-2 pt-2'>
                  <img
                    src={
                      founder.photo && founder.photo.length > 0
                        ? founder.photo[0]
                        : '/assets/images/user.png'
                    }
                    alt={founder.name}
                    className='w-full h-[350px] object-cover rounded-xl'
                  />
                </div>
                <div className='p-3'>
                  <p className='text-xl font-medium'>{founder.name}</p>
                  <p className='text-sm text-gray-500'>{founder.role}</p>
                  {founder.background && (
                    <p className='text-xs text-gray-600 mt-2'>
                      {founder.background}
                    </p>
                  )}
                  <div className='flex gap-2 mt-3'>
                    {founder.email && (
                      <a
                        href={`mailto:${founder.email}`}
                        className='text-blue-500 hover:text-blue-700'
                      >
                        <Mail size={16} />
                      </a>
                    )}
                    {founder.linkedin && (
                      <a
                        href={founder.linkedin}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-500 hover:text-blue-700'
                      >
                        <Linkedin size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-500 mt-4'>
            No founder information available.
          </p>
        )}
      </div>

      {/* Other Team Members */}
      {otherMembers.length > 0 && (
        <div>
          <h2 className='text-2xl font-semibold font-ibm'>Team Members</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4'>
            {otherMembers.map((member, i) => (
              <div
                key={member.id || i}
                className='bg-neutral-100 border border-500 rounded-2xl shadow-sm overflow-hidden'
              >
                <div className='px-2 pt-2'>
                  <img
                    src={
                      member.photo && member.photo.length > 0
                        ? member.photo[0]
                        : '/assets/images/user.png'
                    }
                    alt={member.name}
                    className='w-full h-[250px] object-cover rounded-xl'
                  />
                </div>
                <div className='p-3'>
                  <p className='text-lg font-medium'>{member.name}</p>
                  <p className='text-sm text-gray-500'>{member.role}</p>
                  {member.background && (
                    <p className='text-xs text-gray-600 mt-2'>
                      {member.background}
                    </p>
                  )}
                  <div className='flex gap-2 mt-3'>
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className='text-blue-500 hover:text-blue-700'
                      >
                        <Mail size={16} />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-500 hover:text-blue-700'
                      >
                        <Linkedin size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Founder Background & Additional Info */}
      {(startup.founderBackground || startup.advisors) && (
        <div className='bg-neutral-100 p-4 rounded-[16px]'>
          <h2 className='text-lg font-semibold font-ibm'>
            Additional Information
          </h2>
          <div className='mt-3 space-y-4 bg-neutral-50 p-4 rounded-2xl'>
            {startup.founderBackground && (
              <div className='bg-white rounded-xl p-3'>
                <h3 className='font-medium text-sm mb-2 flex items-center gap-2'>
                  <Award size={16} className='text-blue-500' />
                  Founder Background
                </h3>
                <p className='text-sm text-gray-600'>
                  {startup.founderBackground}
                </p>
              </div>
            )}
            {startup.advisors && (
              <div className='bg-white rounded-xl p-3'>
                <h3 className='font-medium text-sm mb-2 flex items-center gap-2'>
                  <Award size={16} className='text-green-500' />
                  Advisors
                </h3>
                <p className='text-sm text-gray-600'>{startup.advisors}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
