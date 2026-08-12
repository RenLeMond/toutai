import './globals.css';
import './_themes/orangeTheme/theme.css';
import ReshapedProvider from '@/components/reshaped-provider';
import React from 'react';
import { Toaster } from 'sonner';
import Script from 'next/script';
import type { Metadata } from 'next';
import {
  createPageMetadata,
  jsonLd,
  siteUrl
} from '@/_lib/site';

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const cfBeacon = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
const googleSiteVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const baiduSiteVerification = process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...createPageMetadata('home'),
  ...(googleSiteVerification && {
    verification: { google: googleSiteVerification }
  }),
  ...(baiduSiteVerification && {
    other: { 'baidu-site-verification': baiduSiteVerification }
  })
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-rs-theme="orangeTheme" data-rs-color-mode="light">
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
