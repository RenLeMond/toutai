import React from 'react';
import { Text } from 'reshaped';
import WorldClient from './world-client';

function Page() {
  return (
    <>
      <Text as="h1" variant="body-2" color="neutral-faded" className="sr-only">
        投胎模拟器世界版
      </Text>
      <WorldClient />
    </>
  );
}

export default Page;
