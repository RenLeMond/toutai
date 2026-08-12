import React from 'react';
import type { Metadata } from 'next';
import { createPageMetadata } from '@/_lib/site';

export const metadata: Metadata = createPageMetadata('world');

export default function WorldLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
