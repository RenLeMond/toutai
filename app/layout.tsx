import './globals.css';
import './_themes/orangeTheme/theme.css';
import ReshapedProvider from '@/components/reshaped-provider';
import React from 'react';
import { Toaster } from 'sonner';
import Script from 'next/script';
import type { Metadata } from 'next';

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const cfBeacon = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

export const metadata: Metadata = {
  metadataBase: new URL('https://toutai.online'),
  title: '投胎模拟器',
  description: '如果来世还在种花家，你会出生在哪里？'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-rs-theme="orangeTheme" data-rs-color-mode="light">
      <body className="font-sans antialiased">
        <Toaster position="bottom-center" />
        <ReshapedProvider>{children}</ReshapedProvider>
        {adsenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {cfBeacon && (
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${cfBeacon}"}`}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
