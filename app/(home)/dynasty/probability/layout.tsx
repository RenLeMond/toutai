import React from 'react';
import type { Metadata } from 'next';
import { createPageMetadata } from '@/_lib/site';

export const metadata: Metadata = createPageMetadata('dynastyProbability');

export default function DynastyProbabilityLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
