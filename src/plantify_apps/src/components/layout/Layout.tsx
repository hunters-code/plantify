import { ReactNode } from 'react';

import { Footer, Navbar } from '..';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className='min-h-screen bg-white text-gray-900'>
      <Navbar />
      <main className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>{children}</main>
      <Footer />
    </div>
  );
}
