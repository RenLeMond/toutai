import { CLASS_STAMPS, type ClassLevel } from '@/lib/dynasty-rebirth';

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  if (h.length === 3) {
    return [
      parseInt(h[0] + h[0], 16),
      parseInt(h[1] + h[1], 16),
      parseInt(h[2] + h[2], 16)
    ];
  }
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16)
  ];
}

function hexToRgba(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function mixHex(
  foreground: string,
  background: string,
  amount: number
): string {
  const a = parseHex(foreground);
  const b = parseHex(background);
  return `rgb(${Math.round(a[0] * amount + b[0] * (1 - amount))}, ${Math.round(a[1] * amount + b[1] * (1 - amount))}, ${Math.round(a[2] * amount + b[2] * (1 - amount))})`;
}

export function dynastyCardVars(
  classLevel: ClassLevel
): Record<string, string> {
  const tier = CLASS_STAMPS[classLevel];
  return {
    '--tier-color': tier.border,
    '--tier-text': tier.text,
    '--tier-glow': tier.glow,
    '--tier-border': '#f0c55a',
    '--tier-result-bg': mixHex(tier.border, '#3a3228', 0.15),
    '--tier-wash-88': hexToRgba(tier.border, 0.88),
    '--tier-wash-52': hexToRgba(tier.border, 0.52),
    '--tier-wash-16': hexToRgba(tier.border, 0.16),
    '--tier-stamp-fill': hexToRgba(tier.text, 0.1)
  };
}
