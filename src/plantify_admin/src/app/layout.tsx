"use client";

import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <body className="light" style={{ colorScheme: 'light' }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
