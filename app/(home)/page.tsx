import React from 'react';
import { Text } from 'reshaped';
import HomeClient from './home-client';

function Page() {
  return (
    <>
      <Text as="h1" variant="body-2" color="neutral-faded" className="sr-only">
        投胎模拟器中国版
      </Text>
      <HomeClient />
    </>
  );
}

export default Page;
