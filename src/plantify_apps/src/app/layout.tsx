import { Geist, Geist_Mono } from 'next/font/google';

import type { Metadata } from 'next';

import { Providers } from './providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Plantify',
  description: 'Plantify',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href='https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@400;500;600;700&display=swap'
          rel='stylesheet'
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href='https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap'
          rel='stylesheet'
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
