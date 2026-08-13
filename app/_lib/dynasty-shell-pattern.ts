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

const S =
  'fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"';

function hexPath(cx: number, cy: number, r: number) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return `${+(cx + r * Math.cos(a)).toFixed(2)} ${+(cy + r * Math.sin(a)).toFixed(2)}`;
  });
  return `M${pts.join('L')}Z`;
}

function suiInner() {
  const dots = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 10;
    const cx = +(12 + Math.cos(a) * 7.2).toFixed(2);
    const cy = +(12 + Math.sin(a) * 7.2).toFixed(2);
    return `<circle cx="${cx}" cy="${cy}" r="0.85" fill="#ffffff"/>`;
  }).join('');
  return `<circle ${S} cx="12" cy="12" r="7.2" stroke-width="0.55"/>${dots}<path ${S} stroke-width="0.55" d="M12 8.5C13.5 10 13.5 11.2 12 12.5C10.5 11.2 10.5 10 12 8.5Z"/>`;
}

function tangInner() {
  const petals = Array.from({ length: 8 }, (_, i) => {
    return `<ellipse ${S} cx="14" cy="14" rx="3.1" ry="8.2" stroke-width="0.6" transform="rotate(${i * 45} 14 14)"/>`;
  }).join('');
  return `${petals}<circle ${S} cx="14" cy="14" r="2.1" stroke-width="0.65"/>`;
}

const PATTERN_TILES: Record<
  DynastyShellPattern,
  { w: number; h: number; inner: string }
> = {
  qin: {
    w: 16,
    h: 16,
    inner: `<path ${S} stroke-width="0.7" d="M1 8H5V4H8M8 1V5H12V8M15 8H11V12H8M8 15V11H4V8"/>`
  },
  han: {
    w: 32,
    h: 16,
    inner: `<path ${S} stroke-width="0.7" d="M0 9C6 2 10 2 16 9S26 16 32 9"/><path ${S} stroke-width="0.55" d="M0 12C5 7 11 7 16 12S27 17 32 12" opacity="0.65"/>`
  },
  xin: {
    w: 24,
    h: 24,
    inner: `<rect ${S} x="4.5" y="4.5" width="15" height="15" stroke-width="0.7"/><path ${S} stroke-width="0.7" d="M12 4.5V8.5H9.5M12 19.5V15.5H14.5M4.5 12H8.5V9.5M19.5 12H15.5V14.5M4.5 7H7V4.5M17 4.5V7H19.5M19.5 17H17V19.5M7 19.5V17H4.5"/>`
  },
  ehan: {
    w: 14,
    h: 12,
    inner: `<path ${S} stroke-width="0.65" d="M4 3C6 3 7 5 5.5 6.2C4 7.4 2.2 6.2 3.2 4.6C3.5 4 3.7 3.2 4 3Z"/><path ${S} stroke-width="0.65" d="M11 8C13 8 14 10 12.5 11.2C11 12.4 9.2 11.2 10.2 9.6C10.5 9 10.7 8.2 11 8Z" opacity="0.75"/>`
  },
  three: {
    w: 12,
    h: 7,
    inner: `<path ${S} stroke-width="0.7" d="M0 7Q6 1.5 12 7"/><path ${S} stroke-width="0.7" d="M-6 7Q0 1.5 6 7"/>`
  },
  jin: {
    w: 24,
    h: 12,
    inner: `<path ${S} stroke-width="0.9" d="M0 5C6 0 6 10 12 5S18 0 24 5"/><path ${S} stroke-width="0.75" d="M0 8C6 3 6 13 12 8S18 3 24 8" opacity="0.75"/>`
  },
  sn: {
    w: 32,
    h: 16,
    inner: `<path ${S} stroke-width="0.7" d="M0 11C5 3 10 3 14 9C16 14 21 14 26 7C28 10 30 12 32 11"/><path ${S} stroke-width="0.55" d="M14 9C12 6 10 7 11 10"/>`
  },
  sui: { w: 24, h: 24, inner: suiInner() },
  tang: { w: 28, h: 28, inner: tangInner() },
  song: {
    w: 36,
    h: 36,
    inner: `<path ${S} stroke-width="0.8" d="M0 10L8 12L14 6L22 14L30 8L36 10M0 24L10 22L18 28L28 20L36 24M14 0L12 10L16 20L10 30L14 36M26 0L28 8L22 18L30 28L26 36M8 16L18 18L24 12M4 4L10 8M32 16L28 22"/>`
  },
  yuan: {
    w: 20,
    h: 20,
    inner: `<circle ${S} cx="10" cy="10" r="9.2" stroke-width="0.6"/><circle ${S} cx="0" cy="0" r="9.2" stroke-width="0.6"/><path ${S} stroke-width="0.55" d="M10 5.5L14.5 10L10 14.5L5.5 10Z"/>`
  },
  ming: {
    w: 24,
    h: 14,
    inner: `<path ${S} stroke-width="0.65" d="${hexPath(8, 7, 8)}"/><path ${S} stroke-width="0.65" d="${hexPath(20, 0, 8)}"/><path ${S} stroke-width="0.65" d="${hexPath(20, 14, 8)}"/><path ${S} stroke-width="0.5" d="M8 5.2L9.4 7L8 8.8L6.6 7Z"/>`
  },
  qing: {
    w: 22,
    h: 22,
    inner: `<circle ${S} cx="7" cy="7" r="4.6" stroke-width="0.55"/><path ${S} stroke-width="0.5" d="M7 3.6C8.4 5 8.4 6.2 7 7.4C5.6 6.2 5.6 5 7 3.6M7 10.4C8.4 9 8.4 7.8 7 6.6C5.6 7.8 5.6 9 7 10.4"/><circle ${S} cx="18" cy="18" r="3.4" stroke-width="0.5" opacity="0.8"/>`
  }
};

function tileDataUri(w: number, h: number, inner: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}</svg>`;
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
}

export function getShellPatternStyle(dynastyId?: string): {
  backgroundImage: string;
  backgroundRepeat: 'repeat';
  backgroundSize: string;
} {
  const tile = PATTERN_TILES[getShellPattern(dynastyId)];
  return {
    backgroundImage: tileDataUri(tile.w, tile.h, tile.inner),
    backgroundRepeat: 'repeat',
    backgroundSize: `${tile.w}px ${tile.h}px`
  };
}
