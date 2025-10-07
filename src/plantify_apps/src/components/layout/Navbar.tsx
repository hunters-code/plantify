'use client';

import {
  Fingerprint,
  Home,
  Plus,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import React, { useState, useEffect, useRef, JSX } from 'react';

import { Logo } from '../icons';

interface NavItem {
    label: string;
    path: string;
    onClick?: () => void;
    isDashboard?: boolean;
}

export default function Navbar(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getNavigationItems = (): NavItem[] => [
    { label: 'Explore Startups', path: '/', onClick: () => router.push('/') },
    { label: 'How it Works', path: '/', onClick: () => router.push('/') },
    { label: 'About', path: '/', onClick: () => router.push('/') },
    { label: 'For Founders', path: '/', onClick: () => router.push('/') },
  ];

  const isActivePath = (path: string): boolean => {
    if (path.startsWith('#')) return false;
    return pathname === path;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConnectClick = () => {
    router.push('/auth');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-100">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-16">
          {/* Kiri: Brand */}
          <a href="/" className="flex items-center gap-2 justify-start">
            <Logo className="w-6 h-6" />
            <span className="text-2xl font-medium">Plantify</span>
          </a>

          {/* Tengah: Links (desktop) */}
          <ul className="hidden md:flex justify-center items-center gap-6 lg:gap-8 text-sm text-gray-600 whitespace-nowrap justify-self-center">
            {getNavigationItems().map((item, index) => (
              <li key={index}>
                {item.path.startsWith('#') ? (
                  <a
                    className={`hover:text-gray-900 transition ${isActivePath(item.path) ? 'text-gray-900 font-medium' : ''
                    }`}
                    href={item.path}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    className={`hover:text-gray-900 transition ${isActivePath(item.path) ? 'text-gray-900 font-medium' : ''
                    }`}
                    onClick={item.onClick}
                  >
                    {item.isDashboard && (
                      <Home size={14} className="inline mr-1" />
                    )}
                    {item.label === 'Create Startup' && (
                      <Plus size={14} className="inline mr-1" />
                    )}
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Kanan: CTA */}
          <div className="hidden md:flex justify-end">
            <button
              onClick={handleConnectClick}
              className="inline-flex items-center gap-2 rounded-full bg-black text-white px-3.5 py-1.5 text-sm font-medium shadow hover:opacity-90 transition"
            >
              <Fingerprint size={18} />
                            Connect ID
            </button>
          </div>

          {/* Hamburger (mobile) */}
          <button
            className="md:hidden justify-self-end inline-flex items-center rounded-md p-2 hover:bg-gray-100"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        {/* Menu mobile */}
        {open && (
          <div className="md:hidden pb-4">
            <ul className="flex flex-col gap-2 text-sm text-gray-700">
              {getNavigationItems().map((item, index) => (
                <li key={index}>
                  <button
                    className={`w-full text-left px-3.5 py-2 rounded-md hover:bg-gray-100 ${isActivePath(item.path) ? 'font-medium text-gray-900' : ''
                    }`}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <button
                  onClick={handleConnectClick}
                  className="w-full rounded-full bg-black text-white px-3.5 py-2 text-sm font-medium shadow hover:opacity-90"
                >
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
