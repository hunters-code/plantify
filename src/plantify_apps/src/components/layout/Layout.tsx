import { ReactNode } from 'react';

import { Footer, Navbar } from '..';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className='min-h-screen bg-white text-gray-900'>
      <Navbar />
      <main className='p-6'>{children}</main>
      <Footer />
    </div>
  );
}
