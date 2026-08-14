'use client';

import React from 'react';
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
  isNew?: boolean;
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
  isNew = false,
  children
}: DynastyResultCardProps) {
  const stampTier = CLASS_STAMPS[classLevel];

  return (
    <div
      className={`dynasty-card is-result tier-${classLevel}`}
      style={dynastyCardVars(classLevel)}
    >
      <DynastyCardShell dynastyId={dynastyId} />
      {isNew && (
        <div className="corner-badge-ribbon" aria-label="首次解锁">
          <span>NEW</span>
        </div>
      )}
      <div className="dynasty-result-inner">
        <span className="dynasty-badge-pill">
          {dynastyName} · {stampTier.name}
        </span>
        <h3 className="dynasty-hero-title">
          {className}
        </h3>
        <div className="dynasty-details">
          <p className="dynasty-desc">{classDesc}</p>
          <div className="dynasty-meta-line">
            <span className="dynasty-gender">{translateDynastyGender(gender)}</span>
            <span className="dynasty-meta-dot">·</span>
            <span className="dynasty-prob">概率 {formatDynastyProbability(probability)}</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
