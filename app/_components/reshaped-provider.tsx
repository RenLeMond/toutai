'use client';

import React, { ReactNode } from 'react';
import { Reshaped, View } from 'reshaped';

const ReshapedProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Reshaped theme="orangeTheme">
      <View backgroundColor="page" className="app-page-shell">
        {children}
      </View>
    </Reshaped>
  );
};

export default ReshapedProvider;
