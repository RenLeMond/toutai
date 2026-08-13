'use client';

import React from 'react';
import { getShellPatternStyle } from '@/lib/dynasty-shell-pattern';

const S = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.35,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
};

function hexPath(cx: number, cy: number, r: number) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return `${+(cx + r * Math.cos(a)).toFixed(2)} ${+(cy + r * Math.sin(a)).toFixed(2)}`;
  });
  return `M${pts.join('L')}Z`;
}

export function DynastyOrnament({ id }: { id: string }) {
  switch (id) {
    case 'QIN':
      return (
        <>
          <rect x="14" y="14" width="132" height="196" {...S} />
          <rect x="20" y="20" width="120" height="184" {...S} strokeWidth="0.9" />
          {[
            [20, 20, 1, 1],
            [140, 20, -1, 1],
            [20, 204, 1, -1],
            [140, 204, -1, -1]
          ].map(([x, y, sx, sy], i) => (
            <path
              key={i}
              {...S}
              d={`M${x} ${y + 16 * sy}h${16 * sx}v${-16 * sy}M${x} ${y}h${8 * sx}v${8 * sy}h${-8 * sx}z`}
            />
          ))}
        </>
      );
    case 'WESTERN_HAN':
      return (
        <>
          <rect x="12" y="18" width="136" height="188" rx="18" {...S} />
          <path
            {...S}
            d="M26 18c12-10 24-10 36 0c12-10 24-10 36 0c12-10 24-10 36 0"
          />
          <path
            {...S}
            d="M26 206c12 10 24 10 36 0c12 10 24 10 36 0c12 10 24 10 36 0"
          />
        </>
      );
    case 'XIN':
      return (
        <>
          <rect x="14" y="14" width="132" height="196" {...S} />
          <path
            {...S}
            d="M14 79.33h132M14 144.67h132M58 14v196M102 14v196"
            strokeWidth="0.85"
          />
        </>
      );
    case 'EASTERN_HAN':
      return (
        <>
          <rect x="18" y="14" width="124" height="196" {...S} />
          <path {...S} d="M10 14h8v196h-8zM142 14h8v196h-8z" />
          <path {...S} d="M10 14l8-8h124l8 8" />
        </>
      );
    case 'THREE_KINGDOMS':
      return (
        <>
          <rect x="12" y="16" width="136" height="192" rx="6" {...S} />
          <path
            {...S}
            d="M36 16c14-12 30-12 44 0 14-12 30-12 44 0"
            strokeWidth="1.5"
          />
          {[36, 80, 124].map(x => (
            <circle key={x} cx={x} cy="16" r="3.2" fill="currentColor" />
          ))}
        </>
      );
    case 'JIN':
      return (
        <>
          <rect x="26" y="16" width="108" height="192" {...S} />
          <rect x="12" y="16" width="12" height="192" rx="6" {...S} />
          <rect x="136" y="16" width="12" height="192" rx="6" {...S} />
        </>
      );
    case 'SOUTHERN_NORTHERN':
      return (
        <>
          <path {...S} d="M14 51c0-28 26-38 66-38s66 10 66 38v160H14z" />
          {[34, 56, 80, 104, 126].map((x, i) => (
            <path
              key={x}
              {...S}
              d={`M${x} 25c4 8 10 10 12 12-6 2-8 6-12 14-4-8-6-12-12-14 4-2 8-4 12-12z`}
              opacity={i === 2 ? 1 : 0.75}
            />
          ))}
        </>
      );
    case 'SUI':
      return (
        <>
          <rect x="18" y="12" width="124" height="200" {...S} />
          <path {...S} d="M12 12v200M16 12v200M144 12v200M148 12v200" />
        </>
      );
    case 'TANG':
      return (
        <>
          <rect x="14" y="14" width="132" height="196" rx="22" {...S} />
          {[
            [26, 26],
            [134, 26],
            [26, 198],
            [134, 198]
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="8" {...S} />
              <path
                {...S}
                d={`M${x} ${y - 12}v6M${x} ${y + 6}v6M${x - 12} ${y}h6M${x + 6} ${y}h6`}
              />
            </g>
          ))}
        </>
      );
    case 'SONG':
      return (
        <>
          <rect x="14" y="14" width="132" height="196" {...S} strokeWidth="1.2" />
          <rect x="20" y="20" width="120" height="184" {...S} strokeWidth="1.2" />
          {[
            [20, 20, 1, 1],
            [140, 20, -1, 1],
            [20, 204, 1, -1],
            [140, 204, -1, -1]
          ].map(([x, y, sx, sy], i) => (
            <path
              key={i}
              {...S}
              strokeWidth="1.15"
              d={`M${x} ${y}l${12 * sx} ${5 * sy}l${5 * sx} ${12 * sy}M${x + 7 * sx} ${y}l${-3 * sx} ${9 * sy}l${9 * sx} ${3 * sy}`}
            />
          ))}
        </>
      );
    case 'YUAN':
      return (
        <>
          <rect x="16" y="16" width="128" height="192" {...S} />
          <path {...S} d="M16 16h12v2h-10v10h-2z" />
          <path {...S} d="M144 16h-12v2h10v10h2z" />
          <path {...S} d="M16 208h12v-2h-10v-10h-2z" />
          <path {...S} d="M144 208h-12v-2h10v-10h2z" />
        </>
      );
    case 'MING': {
      const left = 14;
      const valleyY = 32;
      const merlonH = 16;
      const step = 12;
      const merlons = 6;
      const parts = [`M${left} ${valleyY}`];
      for (let i = 0; i < merlons; i++) {
        parts.push(`V${valleyY - merlonH}h${step}v${merlonH}`);
        if (i < merlons - 1) parts.push(`h${step}`);
      }
      parts.push(`v176H${left}z`);
      return <path {...S} d={parts.join('')} />;
    }
    case 'QING':
      return (
        <>
          <rect x="16" y="28" width="128" height="168" {...S} />
          <path
            {...S}
            d="M52 28C42 26 38 14 48 10C56 6 62 14 64 20C72 6 88 6 96 20C98 14 104 6 112 10C122 14 118 26 108 28"
          />
          <path
            {...S}
            d="M52 196C42 198 38 210 48 214C56 218 62 210 64 204C72 218 88 218 96 204C98 210 104 218 112 214C122 210 118 198 108 196"
          />
        </>
      );
    default:
      return null;
  }
}

export function DynastyCardShell({ dynastyId }: { dynastyId?: string }) {
  return (
    <>
      <div
        className="dynasty-shell-pattern"
        style={getShellPatternStyle(dynastyId)}
        aria-hidden="true"
      />
      <svg
        className="dynasty-shell-ornament"
        viewBox="0 0 160 224"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <DynastyOrnament id={dynastyId ?? 'TANG'} />
      </svg>
    </>
  );
}
