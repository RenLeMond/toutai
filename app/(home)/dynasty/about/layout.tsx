import React from 'react';
import type { Metadata } from 'next';
import { createPageMetadata } from '@/_lib/site';

export const metadata: Metadata = createPageMetadata('dynastyAbout');

export default function DynastyAboutLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
