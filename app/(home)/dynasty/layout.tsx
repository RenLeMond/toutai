import React from 'react';
import type { Metadata } from 'next';
import { createPageMetadata } from '@/_lib/site';

export const metadata: Metadata = createPageMetadata('dynasty');

export default function DynastyLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
