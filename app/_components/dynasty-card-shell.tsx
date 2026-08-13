'use client';

import React from 'react';

const DYNASTY_SHELLS = [
  { id: 'QIN', pattern: 'qin' },
  { id: 'WESTERN_HAN', pattern: 'han' },
  { id: 'XIN', pattern: 'xin' },
  { id: 'EASTERN_HAN', pattern: 'ehan' },
  { id: 'THREE_KINGDOMS', pattern: 'three' },
  { id: 'JIN', pattern: 'jin' },
  { id: 'SOUTHERN_NORTHERN', pattern: 'sn' },
  { id: 'SUI', pattern: 'sui' },
  { id: 'TANG', pattern: 'tang' },
  { id: 'SONG', pattern: 'song' },
  { id: 'YUAN', pattern: 'yuan' },
  { id: 'MING', pattern: 'ming' },
  { id: 'QING', pattern: 'qing' }
] as const;

type DynastyShellPattern = (typeof DYNASTY_SHELLS)[number]['pattern'];

const PATTERN_BY_ID: Record<string, DynastyShellPattern> = Object.fromEntries(
  DYNASTY_SHELLS.map(item => [item.id, item.pattern])
);

function getShellPattern(dynastyId?: string): DynastyShellPattern {
  return PATTERN_BY_ID[dynastyId ?? ''] ?? 'tang';
}

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

export function DynastyPatternDefs() {
  const p = {
    fill: 'none',
    stroke: '#fff',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
  };

  return (
    <svg className="dynasty-shell-defs" aria-hidden="true">
      <defs>
        <pattern id="pat-qin" width="16" height="16" patternUnits="userSpaceOnUse">
          <path
            {...p}
            strokeWidth="0.7"
            d="M1 8H5V4H8M8 1V5H12V8M15 8H11V12H8M8 15V11H4V8"
          />
        </pattern>
        <pattern id="pat-han" width="32" height="16" patternUnits="userSpaceOnUse">
          <path
            {...p}
            strokeWidth="0.7"
            d="M0 9C6 2 10 2 16 9S26 16 32 9"
          />
          <path
            {...p}
            strokeWidth="0.55"
            d="M0 12C5 7 11 7 16 12S27 17 32 12"
            opacity="0.65"
          />
        </pattern>
        <pattern id="pat-xin" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect {...p} x="4.5" y="4.5" width="15" height="15" strokeWidth="0.7" />
          <path
            {...p}
            strokeWidth="0.7"
            d="M12 4.5V8.5H9.5M12 19.5V15.5H14.5M4.5 12H8.5V9.5M19.5 12H15.5V14.5M4.5 7H7V4.5M17 4.5V7H19.5M19.5 17H17V19.5M7 19.5V17H4.5"
          />
        </pattern>
        <pattern id="pat-ehan" width="14" height="12" patternUnits="userSpaceOnUse">
          <path
            {...p}
            strokeWidth="0.65"
            d="M4 3C6 3 7 5 5.5 6.2C4 7.4 2.2 6.2 3.2 4.6C3.5 4 3.7 3.2 4 3Z"
          />
          <path
            {...p}
            strokeWidth="0.65"
            d="M11 8C13 8 14 10 12.5 11.2C11 12.4 9.2 11.2 10.2 9.6C10.5 9 10.7 8.2 11 8Z"
            opacity="0.75"
          />
        </pattern>
        <pattern id="pat-three" width="12" height="7" patternUnits="userSpaceOnUse">
          <path {...p} strokeWidth="0.7" d="M0 7Q6 1.5 12 7" />
          <path {...p} strokeWidth="0.7" d="M-6 7Q0 1.5 6 7" />
        </pattern>
        <pattern id="pat-jin" width="24" height="12" patternUnits="userSpaceOnUse">
          <path {...p} strokeWidth="0.9" d="M0 5C6 0 6 10 12 5S18 0 24 5" />
          <path
            {...p}
            strokeWidth="0.75"
            d="M0 8C6 3 6 13 12 8S18 3 24 8"
            opacity="0.75"
          />
        </pattern>
        <pattern id="pat-sn" width="32" height="16" patternUnits="userSpaceOnUse">
          <path
            {...p}
            strokeWidth="0.7"
            d="M0 11C5 3 10 3 14 9C16 14 21 14 26 7C28 10 30 12 32 11"
          />
          <path {...p} strokeWidth="0.55" d="M14 9C12 6 10 7 11 10" />
        </pattern>
        <pattern id="pat-sui" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle {...p} cx="12" cy="12" r="7.2" strokeWidth="0.55" />
          {Array.from({ length: 10 }, (_, i) => {
            const a = (Math.PI * 2 * i) / 10;
            return (
              <circle
                key={i}
                cx={12 + Math.cos(a) * 7.2}
                cy={12 + Math.sin(a) * 7.2}
                r="0.85"
                fill="#fff"
              />
            );
          })}
          <path
            {...p}
            strokeWidth="0.55"
            d="M12 8.5C13.5 10 13.5 11.2 12 12.5C10.5 11.2 10.5 10 12 8.5Z"
          />
        </pattern>
        <pattern id="pat-tang" width="28" height="28" patternUnits="userSpaceOnUse">
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse
              key={i}
              {...p}
              cx="14"
              cy="14"
              rx="3.1"
              ry="8.2"
              strokeWidth="0.6"
              transform={`rotate(${i * 45} 14 14)`}
            />
          ))}
          <circle {...p} cx="14" cy="14" r="2.1" strokeWidth="0.65" />
        </pattern>
        <pattern id="pat-song" width="36" height="36" patternUnits="userSpaceOnUse">
          <path
            {...p}
            strokeWidth="0.8"
            d="M0 10L8 12L14 6L22 14L30 8L36 10M0 24L10 22L18 28L28 20L36 24M14 0L12 10L16 20L10 30L14 36M26 0L28 8L22 18L30 28L26 36M8 16L18 18L24 12M4 4L10 8M32 16L28 22"
          />
        </pattern>
        <pattern id="pat-yuan" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle {...p} cx="10" cy="10" r="9.2" strokeWidth="0.6" />
          <circle {...p} cx="0" cy="0" r="9.2" strokeWidth="0.6" />
          <path {...p} strokeWidth="0.55" d="M10 5.5L14.5 10L10 14.5L5.5 10Z" />
        </pattern>
        <pattern id="pat-ming" width="24" height="14" patternUnits="userSpaceOnUse">
          <path {...p} strokeWidth="0.65" d={hexPath(8, 7, 8)} />
          <path {...p} strokeWidth="0.65" d={hexPath(20, 0, 8)} />
          <path {...p} strokeWidth="0.65" d={hexPath(20, 14, 8)} />
          <path {...p} strokeWidth="0.5" d="M8 5.2L9.4 7L8 8.8L6.6 7Z" />
        </pattern>
        <pattern id="pat-qing" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle {...p} cx="7" cy="7" r="4.6" strokeWidth="0.55" />
          <path
            {...p}
            strokeWidth="0.5"
            d="M7 3.6C8.4 5 8.4 6.2 7 7.4C5.6 6.2 5.6 5 7 3.6M7 10.4C8.4 9 8.4 7.8 7 6.6C5.6 7.8 5.6 9 7 10.4"
          />
          <circle {...p} cx="18" cy="18" r="3.4" strokeWidth="0.5" opacity="0.8" />
        </pattern>
      </defs>
    </svg>
  );
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
  const pattern = getShellPattern(dynastyId);

  return (
    <>
      <svg className="dynasty-shell-pattern" aria-hidden="true">
        <rect width="100%" height="100%" fill={`url(#pat-${pattern})`} />
      </svg>
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
