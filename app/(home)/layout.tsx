import { Container, View } from 'reshaped';
import React from 'react';
import type { Metadata } from 'next';
import Title from '@/components/title';
import Navbar from '@/components/navbar';
import ResetModal from '@/components/reset-modal';
import ShareModal from '@/components/share-modal';
import AppVersionHydrator from '@/components/app-version-hydrator';
import { createPageMetadata } from '@/_lib/site';

export const metadata: Metadata = createPageMetadata('home');

export default function HomepageLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppVersionHydrator />
      <ResetModal />
      <ShareModal />
      <Container width="640px" padding={1}>
        <View
          padding={4}
          direction="row"
          justify="space-between"
          align="center"
          as="header"
        >
          <Title />
          <Navbar />
        </View>
        {children}
      </Container>
    </>
  );
}
