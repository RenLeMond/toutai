import './globals.css';
import './_themes/orangeTheme/theme.css';
import ReshapedProvider from '@/components/reshaped-provider';
import React from 'react';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://toutai.online')
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-rs-theme="orangeTheme" data-rs-color-mode="light">
      <body className="font-sans antialiased">
        <Toaster position="bottom-center" />
        <ReshapedProvider>{children}</ReshapedProvider>
        <Analytics />
      </body>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1341437621876451"
        crossOrigin="anonymous"
      />
    </html>
  );
}
