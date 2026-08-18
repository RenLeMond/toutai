'use client';

import React from 'react';
import { Text, View } from 'reshaped';

export function MapStageSkeleton({ label = '地图加载中' }: { label?: string }) {
  return (
    <View
      className="map-stage-skeleton"
      align="center"
      justify="center"
      paddingBlock={16}
      gap={3}
      attributes={{ role: 'status', 'aria-live': 'polite' }}
    >
      <Text color="neutral-faded" variant="body-3">
        {label}
      </Text>
      <div className="skeleton-stack" aria-hidden="true">
        <span className="skeleton-line" />
        <span className="skeleton-line skeleton-line--short" />
        <span className="skeleton-line skeleton-line--shorter" />
      </div>
    </View>
  );
}
