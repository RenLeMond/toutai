import { Container } from 'reshaped';
import React from 'react';
import type { Metadata } from 'next';
import { createPageMetadata } from '@/_lib/site';

export const metadata: Metadata = createPageMetadata('worldData');

export default function WorldDataLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Container width="640px">{children}</Container>
    </>
  );
}
