import { Fingerprint } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
            <button className='inline-flex items-center gap-2 rounded-full bg-black text-white px-3.5 py-1.5 text-sm font-medium shadow hover:opacity-90 transition'>
              <Fingerprint size={18} />
              Connect ID
            </button>
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
                <button className='w-full rounded-full bg-black text-white px-3.5 py-2 text-sm font-medium shadow hover:opacity-90'>
                  Connect ID
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
