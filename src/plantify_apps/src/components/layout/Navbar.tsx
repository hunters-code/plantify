'use client';

import {
  Fingerprint,
  Home,
  Plus,
  User,
  LogOut,
  Copy,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import React, { useState, useEffect, useRef, JSX } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import type { TransferAccount } from '@/declarations/plantify_backend/plantify_backend.did';
import { icrcService } from '@/services/ICRCService';
import { Principal } from '@dfinity/principal';

import { Logo } from '../icons';

interface NavItem {
  label: string;
  path: string;
  onClick: () => void;
  isDashboard?: boolean;
}

export default function Navbar(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [icpBalance, setIcpBalance] = useState<string>('0');
  const [ckUSDCBalance, setCkUSDCBalance] = useState<string>('0');
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);
  const [signOutLoading, setSignOutLoading] = useState<boolean>(false);
  const [balancesFetched, setBalancesFetched] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    isAuthenticated,
    isLoading,
    userType,
    principal,
    signOut,
    getIdentity,
  } = useAuth();

  const getNavigationItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      { label: 'Explore Startups', path: '/', onClick: () => router.push('/') },
      { label: 'How it Works', path: '/', onClick: () => router.push('/') },
      { label: 'About', path: '/', onClick: () => router.push('/') },
    ];

    return baseItems;
  };

  const isActivePath = (path: string): boolean => {
    if (path.startsWith('#')) return false;
    return pathname === path;
  };

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

  // Reset balances when user signs out
  useEffect(() => {
    if (!isAuthenticated) {
      setBalancesFetched(false);
      setIcpBalance('0');
      setCkUSDCBalance('0');
    }
  }, [isAuthenticated]);

  const handleConnectClick = async () => {
    if (isAuthenticated) {
      setDropdownOpen(!dropdownOpen);
      // Always fetch balances when dropdown is opened to ensure fresh data
      fetchBalances();
    } else {
      // Redirect to auth page instead of calling signIn directly
      router.push('/auth');
    }
  };

  const fetchBalances = async () => {
    if (!isAuthenticated || !principal) return;

    setBalanceLoading(true);
    try {
      let principalObj;
      try {
        principalObj = Principal.fromText(principal);
      } catch (error) {
        console.error('Error creating Principal from text:', error);
        throw new Error(`Invalid principal format: ${principal}`);
      }

      // Get balances directly from ICRC service
      const [icpBalance, ckUSDCBalance] = await Promise.all([
        icrcService.getBalanceInUnits(principalObj, 'ICP'),
        icrcService.getBalanceInUnits(principalObj, 'ckUSDC'),
      ]);
      setIcpBalance(icpBalance.toFixed(0));
      setCkUSDCBalance(ckUSDCBalance.toFixed(0));
    } catch (error) {
      console.error('Failed to fetch balances:', error);
      setIcpBalance('0.0000');
      setCkUSDCBalance('0.00');
    } finally {
      setBalanceLoading(false);
      setBalancesFetched(true);
    }
  };

  const copyPrincipal = async () => {
    try {
      if (principal) {
        await navigator.clipboard.writeText(principal);
      }
    } catch (error) {
      console.error('Failed to copy principal:', error);
    }
  };

  const formatPrincipal = (principal: string | null): string => {
    if (!principal) return '';
    return `${principal.slice(0, 5)}...${principal.slice(-5)}`;
  };

  const handleSignOut = async () => {
    try {
      setSignOutLoading(true);
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setSignOutLoading(false);
    }
  };

  return (
    <header className='sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-100'>
      <nav className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-[auto_1fr_auto] items-center h-16'>
          <button
            onClick={() => router.push('/')}
            className='flex items-center gap-2 justify-start'
          >
            <Logo className='w-6 h-6' />
            <span className='text-2xl font-medium'>Plantify</span>
          </button>

          <ul className='hidden md:flex justify-center items-center gap-6 lg:gap-8 text-sm text-gray-600 whitespace-nowrap justify-self-center'>
            {getNavigationItems().map((item, index) => (
              <li key={index}>
                {item.path.startsWith('#') ? (
                  <a
                    className={`hover:text-gray-900 transition ${
                      isActivePath(item.path) ? 'text-gray-900 font-medium' : ''
                    }`}
                    href={item.path}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    className={`hover:text-gray-900 transition ${
                      isActivePath(item.path) ? 'text-gray-900 font-medium' : ''
                    }`}
                    onClick={item.onClick}
                  >
                    {item.isDashboard && (
                      <Home size={14} className='inline mr-1' />
                    )}
                    {item.label === 'Create Startup' && (
                      <Plus size={14} className='inline mr-1' />
                    )}
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>

          <div className='hidden md:flex justify-end'>
            {isAuthenticated ? (
              <div className='flex items-center gap-3'>
                <div className='relative' ref={dropdownRef}>
                  <button
                    onClick={handleConnectClick}
                    className='flex items-center gap-2 rounded-full bg-green-100 text-green-800 px-3.5 py-1.5 text-sm font-medium hover:bg-green-200 transition'
                  >
                    <User size={16} />
                    {formatPrincipal(principal)}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className='absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50'>
                      <div className='p-4'>
                        {userType && (
                          <div className='mb-4'>
                            <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
                              Account Type
                            </label>
                            <div className='mt-1'>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  userType === 'founder'
                                    ? 'bg-blue-100 text-blue-800'
                                    : userType === 'investor'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {userType === 'founder'
                                  ? 'Founder'
                                  : userType === 'investor'
                                    ? 'Investor'
                                    : 'User'}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className='mb-4'>
                          <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
                            Principal ID
                          </label>
                          <div className='flex items-center gap-2 mt-1'>
                            <code className='flex-1 text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-800 break-all overflow-hidden'>
                              {principal || 'Not available'}
                            </code>
                            <button
                              onClick={copyPrincipal}
                              className='p-1 hover:bg-gray-200 rounded transition flex-shrink-0'
                              title='Copy Principal ID'
                            >
                              <Copy size={16} className='text-gray-600' />
                            </button>
                          </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
                              ICP Balance
                            </label>
                            <div className='mt-1 text-lg font-semibold text-gray-900'>
                              {balanceLoading ? (
                                <Loader2 size={16} className='animate-spin' />
                              ) : (
                                `${icpBalance} ICP`
                              )}
                            </div>
                          </div>

                          <div>
                            <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
                              ckUSDC Balance
                            </label>
                            <div className='mt-1 text-lg font-semibold text-gray-900'>
                              {balanceLoading ? (
                                <Loader2 size={16} className='animate-spin' />
                              ) : (
                                <div className='flex items-center gap-1'>
                                  <span>{ckUSDCBalance} ckUSDC</span>
                                  <span className='text-xs text-green-600 font-normal'>
                                    (ICRC)
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSignOut}
                  disabled={signOutLoading}
                  className='inline-flex items-center gap-2 rounded-full bg-gray-100 text-gray-700 px-3.5 py-1.5 text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50'
                >
                  {signOutLoading ? (
                    <Loader2 size={16} className='animate-spin' />
                  ) : (
                    <LogOut size={16} />
                  )}
                  {signOutLoading ? 'Signing Out...' : 'Sign Out'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectClick}
                disabled={isLoading}
                className='inline-flex items-center gap-2 rounded-full bg-black text-white px-3.5 py-1.5 text-sm font-medium shadow hover:opacity-90 transition disabled:opacity-50'
              >
                <Fingerprint size={18} />
                {isLoading ? 'Connecting...' : 'Connect ID'}
              </button>
            )}
          </div>

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

        {open && (
          <div className='md:hidden pb-4'>
            <ul className='flex flex-col gap-2 text-sm text-gray-700'>
              {getNavigationItems().map((item, index) => (
                <li key={index}>
                  <button
                    className={`w-full text-left px-3.5 py-2 rounded-md hover:bg-gray-100 ${
                      isActivePath(item.path) ? 'font-medium text-gray-900' : ''
                    }`}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li className='pt-2'>
                {isAuthenticated ? (
                  <div className='space-y-2'>
                    <div className='relative'>
                      <button
                        onClick={handleConnectClick}
                        className='w-full flex items-center gap-2 rounded-full bg-green-100 text-green-800 px-3.5 py-2 text-sm font-medium justify-center hover:bg-green-200 transition'
                      >
                        <User size={16} />
                        {formatPrincipal(principal)}
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {dropdownOpen && (
                        <div className='mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200'>
                          <div className='p-4'>
                            {userType && (
                              <div className='mb-4'>
                                <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
                                  Account Type
                                </label>
                                <div className='mt-1'>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      userType === 'founder'
                                        ? 'bg-blue-100 text-blue-800'
                                        : userType === 'investor'
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {userType === 'founder'
                                      ? 'Founder'
                                      : userType === 'investor'
                                        ? 'Investor'
                                        : 'User'}
                                  </span>
                                </div>
                              </div>
                            )}

                            <div className='mb-4'>
                              <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
                                Principal ID
                              </label>
                              <div className='flex items-center gap-2 mt-1'>
                                <code className='flex-1 text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-800 break-all'>
                                  {principal || 'Not available'}
                                </code>
                                <button
                                  onClick={copyPrincipal}
                                  className='p-1 hover:bg-gray-200 rounded transition'
                                  title='Copy Principal ID'
                                >
                                  <Copy size={16} className='text-gray-600' />
                                </button>
                              </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                              <div>
                                <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
                                  ICP Balance
                                </label>
                                <div className='mt-1 text-lg font-semibold text-gray-900'>
                                  {balanceLoading ? (
                                    <Loader2
                                      size={16}
                                      className='animate-spin'
                                    />
                                  ) : (
                                    `${icpBalance} ICP`
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
                                  ckUSDC Balance
                                </label>
                                <div className='mt-1 text-lg font-semibold text-gray-900'>
                                  {balanceLoading ? (
                                    <Loader2
                                      size={16}
                                      className='animate-spin'
                                    />
                                  ) : (
                                    <div className='flex items-center gap-1'>
                                      <span>{ckUSDCBalance} ckUSDC</span>
                                      <span className='text-xs text-green-600 font-normal'>
                                        (ICRC)
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleSignOut}
                      disabled={signOutLoading}
                      className='w-full rounded-full bg-gray-100 text-gray-700 px-3.5 py-2 text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50'
                    >
                      {signOutLoading ? (
                        <Loader2
                          size={16}
                          className='inline mr-2 animate-spin'
                        />
                      ) : (
                        <LogOut size={16} className='inline mr-2' />
                      )}
                      {signOutLoading ? 'Signing Out...' : 'Sign Out'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleConnectClick}
                    disabled={isLoading}
                    className='w-full rounded-full bg-black text-white px-3.5 py-2 text-sm font-medium shadow hover:opacity-90 disabled:opacity-50'
                  >
                    {isLoading ? 'Connecting...' : 'Connect ID'}
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
