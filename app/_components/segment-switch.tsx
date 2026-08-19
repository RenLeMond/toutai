'use client';

import React from 'react';

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentSwitchProps<T extends string> = {
  value: T;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: 'sm' | 'md';
};

export function SegmentSwitch<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  size = 'md'
}: SegmentSwitchProps<T>) {
  return (
    <div
      className={`segment-switch ${size === 'sm' ? 'segment-switch--sm' : ''}`}
      role="group"
      aria-label={ariaLabel}
    >
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          className={`segment-pill ${value === option.value ? 'is-active' : ''}`}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
