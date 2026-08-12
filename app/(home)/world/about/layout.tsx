import React from 'react';
import type { Metadata } from 'next';
import { createPageMetadata } from '@/_lib/site';

export const metadata: Metadata = createPageMetadata('worldAbout');

export default function WorldAboutLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
