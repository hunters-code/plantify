import { Fingerprint, User, LogOut, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, principal, signOut } = useAuth();
  const navigate = useNavigate();

  // Add effect to handle loading state
  useEffect(() => {
    // Check if auth data is loaded
    if (isAuthenticated !== undefined) {
      // Give a small delay for smoother UX
      const timer = setTimeout(() => {
        setLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, principal]);

  const handleConnectClick = () => {
    if (isAuthenticated) {
      // If already logged in, do nothing or show user menu
      return;
    } else {
      // If not logged in, navigate to auth page
      navigate('/auth');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const formatPrincipal = principal => {
    if (!principal) return '';
    const principalStr = principal.toString();
    return `${principalStr.slice(0, 5)}...${principalStr.slice(-5)}`;
  };

  return (
    <header className='sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-100'>
      <nav className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Bar utama */}
        <div className='grid grid-cols-[auto_1fr_auto] items-center h-16'>
          {/* Kiri: Brand */}
          <a href='/' className='flex items-center gap-2 justify-start'>
            <img
              src='/assets/images/company-logo.png'
              alt='Coworking founders and investors'
              className='w-32 object-cover'
            />
          </a>

          {/* Tengah: Links (desktop) — benar2 center & no-wrap */}
          <ul className='hidden md:flex justify-center items-center gap-6 lg:gap-8 text-sm text-gray-600 whitespace-nowrap justify-self-center'>
            <li>
              <a className='hover:text-gray-900 transition' href='#explore'>
                Explore Startups
              </a>
            </li>
            <li>
              <a className='hover:text-gray-900 transition' href='#how'>
                How it Works
              </a>
            </li>
            <li>
              <a className='hover:text-gray-900 transition' href='#about'>
                About
              </a>
            </li>
            <li>
              <a className='hover:text-gray-900 transition' href='#founders'>
                For Founders
              </a>
            </li>
          </ul>

          {/* Kanan: CTA */}
          <div className='hidden md:flex justify-end'>
            {isAuthenticated ? (
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-2 rounded-full bg-green-100 text-green-800 px-3.5 py-1.5 text-sm font-medium'>
                  <User size={16} />
                  {formatPrincipal(principal)}
                </div>
                <button
                  onClick={handleSignOut}
                  className='inline-flex items-center gap-2 rounded-full bg-gray-100 text-gray-700 px-3.5 py-1.5 text-sm font-medium hover:bg-gray-200 transition'
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectClick}
                className='inline-flex items-center gap-2 rounded-full bg-black text-white px-3.5 py-1.5 text-sm font-medium shadow hover:opacity-90 transition'
              >
                <Fingerprint size={18} />
                Connect ID
              </button>
            )}
          </div>

          {/* Hamburger (mobile) */}
          <button
            className='md:hidden justify-self-end inline-flex items-center rounded-md p-2 hover:bg-gray-100'
            onClick={() => setOpen(!open)}
            aria-label='Toggle menu'
          >
            <svg className='h-6 w-6' viewBox='0 0 24 24' fill='none'>
              <path
                d='M4 7h16M4 12h16M4 17h16'
                stroke='currentColor'
                strokeWidth='2'
              />
            </svg>
          </button>
        </div>

        {/* Menu mobile */}
        {open && (
          <div className='md:hidden pb-4'>
            <ul className='flex flex-col gap-2 text-sm text-gray-700'>
              <li>
                <a
                  className='block rounded px-2 py-2 hover:bg-gray-100'
                  href='#explore'
                >
                  Explore Startups
                </a>
              </li>
              <li>
                <a
                  className='block rounded px-2 py-2 hover:bg-gray-100'
                  href='#how'
                >
                  How it Works
                </a>
              </li>
              <li>
                <a
                  className='block rounded px-2 py-2 hover:bg-gray-100'
                  href='#about'
                >
                  About
                </a>
              </li>
              <li>
                <a
                  className='block rounded px-2 py-2 hover:bg-gray-100'
                  href='#founders'
                >
                  For Founders
                </a>
              </li>
              <li className='pt-2'>
                {isAuthenticated ? (
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 rounded-full bg-green-100 text-green-800 px-3.5 py-2 text-sm font-medium justify-center'>
                      <User size={16} />
                      {formatPrincipal(principal)}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className='w-full rounded-full bg-gray-100 text-gray-700 px-3.5 py-2 text-sm font-medium hover:bg-gray-200 transition'
                    >
                      <LogOut size={16} className='inline mr-2' />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleConnectClick}
                    className='w-full rounded-full bg-black text-white px-3.5 py-2 text-sm font-medium shadow hover:opacity-90'
                  >
                    Connect ID
                  </button>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
