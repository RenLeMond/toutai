import React from 'react';
import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/site';
import DynastyTestClient from '../dynasty/test/dynasty-test-client';

export const metadata: Metadata = createPageMetadata('test');

function Page() {
  return <DynastyTestClient />;
}

export default Page;
