'use client';

import React from 'react';
import { Text, View } from 'reshaped';
import {
  CLASS_STAMPS,
  type ClassLevel,
  formatDynastyProbability,
  translateDynastyGender
} from '@/lib/dynasty-rebirth';
import { dynastyCardVars } from '@/lib/dynasty-card-style';
import { DynastyCardShell } from '@/components/dynasty-card-shell';
import './dynasty-flip-card.css';

export type DynastyResultCardProps = {
  dynastyId?: string;
  dynastyName: string;
  className: string;
  classLevel: ClassLevel;
  classDesc: string;
  gender: 'male' | 'female';
  probability: number;
  children?: React.ReactNode;
};

export function DynastyResultCard({
  dynastyId,
  dynastyName,
  className,
  classLevel,
  classDesc,
  gender,
  probability,
  children
}: DynastyResultCardProps) {
  const stampTier = CLASS_STAMPS[classLevel];

  return (
    <div
      className={`dynasty-card is-result tier-${classLevel}`}
      style={dynastyCardVars(classLevel)}
    >
      <DynastyCardShell dynastyId={dynastyId} />
      <View className="dynasty-result-inner" gap={1} height="100%" justify="center">
        <Text
          variant="featured-3"
          weight="medium"
          align="center"
          className="dynasty-card-title"
        >
          {dynastyName}
        </Text>
        <View align="center">
          <span className="dynasty-stamp">{stampTier.name}</span>
        </View>
        <Text
          variant="caption-1"
          weight="medium"
          align="center"
          className="dynasty-card-class"
        >
          {className}
        </Text>
        <div className="dynasty-details">
          <Text variant="caption-2" color="neutral-faded" align="center">
            {translateDynastyGender(gender)}
          </Text>
          <Text variant="caption-1" align="center" className="dynasty-desc">
            {classDesc}
          </Text>
          <Text variant="caption-1" align="center" className="dynasty-prob">
            概率 {formatDynastyProbability(probability)}
          </Text>
        </div>
      </View>
      {children}
    </div>
  );
}
