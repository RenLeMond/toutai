import {
  CLASS_STAMPS,
  DEFAULT_CLASS_LEVEL,
  type ClassLevel,
  formatDynastyProbability,
  translateDynastyGender
} from '@/lib/dynasty-rebirth';
import { dynastyCardVars } from '@/lib/dynasty-card-style';
import { getShellPatternStyle } from '@/lib/dynasty-shell-pattern';
import type { ShareInfo } from '@/lib/store/useShareModal';
import { siteIconSmall, siteUrl } from '@/lib/site';
import qrcode from 'qrcode-generator';

export const POSTER_WIDTH = 1080;
export const POSTER_HEIGHT = 1440;
export const RESULT_CARD_CSS_WIDTH = 200;
export const CARD_WIDTH = 700;
export const CARD_HEIGHT = 980;
export const CARD_SCALE = CARD_WIDTH / RESULT_CARD_CSS_WIDTH;
export const CARD_X = (POSTER_WIDTH - CARD_WIDTH) / 2; // 190
export const CARD_Y = 130;
export const CARD_RADIUS = 12 * CARD_SCALE;
export const DYNASTY_SHARE_URL = `${siteUrl}/dynasty`;
export const FONT_FAMILY =
  'Inter, BlinkMacSystemFont, -apple-system, "Segoe UI", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif';
export const CSS_BADGE_SIZE = 11;
export const CSS_TITLE_SIZE = 24;
export const CSS_DESC_SIZE = 11.5;
export const CSS_META_SIZE = 11;
export const CSS_PAD_X = 20;
export const TEXT_INSET = CSS_PAD_X * CARD_SCALE;
export const TITLE_MAX_WIDTH = CARD_WIDTH - TEXT_INSET * 2;
export const DESC_MAX_WIDTH = TITLE_MAX_WIDTH;
export const DESC_MAX_LINES = 2;
export const TITLE_MAX_LINES = 2;
export const PILL_PAD_X = 10 * CARD_SCALE * 2;
export const TITLE_FONT_SIZE = CSS_TITLE_SIZE * CARD_SCALE;
export const DESC_FONT_SIZE = CSS_DESC_SIZE * CARD_SCALE;
export const BADGE_FONT_SIZE = CSS_BADGE_SIZE * CARD_SCALE;
export const META_FONT_SIZE = CSS_META_SIZE * CARD_SCALE;
export const FLAVOR_MAX_WIDTH = 720;
export const FLAVOR_MAX_LINES = 2;
export const FLAVOR_LINE_H = 48;
export const FOOTER_Y = 1260;
export const CARD_BOTTOM = CARD_Y + CARD_HEIGHT;

export type MeasureTextFn = (text: string, fontSize: number) => number;

function strokeAttrs(width = 1.35): string {
  return `fill="none" stroke="#ece8e0" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"`;
}

function mingMerlonPath(): string {
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
  return parts.join('');
}

function tangOrnament(S: string): string {
  return `
        <rect x="14" y="14" width="132" height="196" rx="22" ${S} />
        <g><circle cx="26" cy="26" r="8" ${S} /><path ${S} d="M26 14v6M26 32v6M14 26h6M32 26h6" /></g>
        <g><circle cx="134" cy="26" r="8" ${S} /><path ${S} d="M134 14v6M134 32v6M122 26h6M140 26h6" /></g>
        <g><circle cx="26" cy="198" r="8" ${S} /><path ${S} d="M26 186v6M26 204v6M14 198h6M32 198h6" /></g>
        <g><circle cx="134" cy="198" r="8" ${S} /><path ${S} d="M134 186v6M134 204v6M122 198h6M140 198h6" /></g>
      `;
}

export function getDynastyOrnamentSvg(dynastyId?: string): string {
  const S = strokeAttrs();

  let inner = '';
  switch (dynastyId) {
    case 'QIN':
      inner = `
        <rect x="14" y="14" width="132" height="196" ${S} />
        <rect x="20" y="20" width="120" height="184" ${strokeAttrs(0.9)} />
        <path ${S} d="M20 36h16v-16M20 20h8v8h-8z" />
        <path ${S} d="M140 36h-16v-16M140 20h-8v8h8z" />
        <path ${S} d="M20 188h16v16M20 204h8v-8h-8z" />
        <path ${S} d="M140 188h-16v16M140 204h-8v-8h8z" />
      `;
      break;
    case 'WESTERN_HAN':
      inner = `
        <rect x="12" y="18" width="136" height="188" rx="18" ${S} />
        <path ${S} d="M26 18c12-10 24-10 36 0c12-10 24-10 36 0c12-10 24-10 36 0" />
        <path ${S} d="M26 206c12 10 24 10 36 0c12 10 24 10 36 0c12 10 24 10 36 0" />
      `;
      break;
    case 'XIN':
      inner = `
        <rect x="14" y="14" width="132" height="196" ${S} />
        <path ${strokeAttrs(0.85)} d="M14 79.33h132M14 144.67h132M58 14v196M102 14v196" />
      `;
      break;
    case 'EASTERN_HAN':
      inner = `
        <rect x="18" y="14" width="124" height="196" ${S} />
        <path ${S} d="M10 14h8v196h-8zM142 14h8v196h-8z" />
        <path ${S} d="M10 14l8-8h124l8 8" />
      `;
      break;
    case 'THREE_KINGDOMS':
      inner = `
        <rect x="12" y="16" width="136" height="192" rx="6" ${S} />
        <path ${strokeAttrs(1.5)} d="M36 16c14-12 30-12 44 0 14-12 30-12 44 0" />
        <circle cx="36" cy="16" r="3.2" fill="#ece8e0" />
        <circle cx="80" cy="16" r="3.2" fill="#ece8e0" />
        <circle cx="124" cy="16" r="3.2" fill="#ece8e0" />
      `;
      break;
    case 'JIN':
      inner = `
        <rect x="26" y="16" width="108" height="192" ${S} />
        <rect x="12" y="16" width="12" height="192" rx="6" ${S} />
        <rect x="136" y="16" width="12" height="192" rx="6" ${S} />
      `;
      break;
    case 'SOUTHERN_NORTHERN':
      inner = `
        <path ${S} d="M14 51c0-28 26-38 66-38s66 10 66 38v160H14z" />
        <path ${S} d="M34 25c4 8 10 10 12 12-6 2-8 6-12 14-4-8-6-12-12-14 4-2 8-4 12-12z" opacity="0.75" />
        <path ${S} d="M56 25c4 8 10 10 12 12-6 2-8 6-12 14-4-8-6-12-12-14 4-2 8-4 12-12z" opacity="0.75" />
        <path ${S} d="M80 25c4 8 10 10 12 12-6 2-8 6-12 14-4-8-6-12-12-14 4-2 8-4 12-12z" opacity="1" />
        <path ${S} d="M104 25c4 8 10 10 12 12-6 2-8 6-12 14-4-8-6-12-12-14 4-2 8-4 12-12z" opacity="0.75" />
        <path ${S} d="M126 25c4 8 10 10 12 12-6 2-8 6-12 14-4-8-6-12-12-14 4-2 8-4 12-12z" opacity="0.75" />
      `;
      break;
    case 'SUI':
      inner = `
        <rect x="18" y="12" width="124" height="200" ${S} />
        <path ${S} d="M12 12v200M16 12v200M144 12v200M148 12v200" />
      `;
      break;
    case 'TANG':
      inner = tangOrnament(S);
      break;
    case 'SONG':
      inner = `
        <rect x="14" y="14" width="132" height="196" ${strokeAttrs(1.2)} />
        <rect x="20" y="20" width="120" height="184" ${strokeAttrs(1.2)} />
        <path ${strokeAttrs(1.15)} d="M20 20l12 5l5 12M27 20l-3 9l9 3" />
        <path ${strokeAttrs(1.15)} d="M140 20l-12 5l-5 12M133 20l3 9l-9 3" />
        <path ${strokeAttrs(1.15)} d="M20 204l12 -5l5 -12M27 204l-3 -9l9 -3" />
        <path ${strokeAttrs(1.15)} d="M140 204l-12 -5l-5 -12M133 204l3 -9l-9 -3" />
      `;
      break;
    case 'YUAN':
      inner = `
        <rect x="16" y="16" width="128" height="192" ${S} />
        <path ${S} d="M16 16h12v2h-10v10h-2z" />
        <path ${S} d="M144 16h-12v2h10v10h2z" />
        <path ${S} d="M16 208h12v-2h-10v-10h-2z" />
        <path ${S} d="M144 208h-12v-2h10v-10h2z" />
      `;
      break;
    case 'MING':
      inner = `
        <path ${strokeAttrs(1.6)} d="${mingMerlonPath()}" />
      `;
      break;
    case 'QING':
      inner = `
        <rect x="16" y="28" width="128" height="168" ${S} />
        <path ${S} d="M52 28C42 26 38 14 48 10C56 6 62 14 64 20C72 6 88 6 96 20C98 14 104 6 112 10C122 14 118 26 108 28" />
        <path ${S} d="M52 196C42 198 38 210 48 214C56 218 62 210 64 204C72 218 88 218 96 204C98 210 104 218 112 214C122 210 118 198 108 196" />
      `;
      break;
    default:
      inner = tangOrnament(S);
      break;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 224" width="${CARD_WIDTH}" height="${CARD_HEIGHT}">${inner}</svg>`;
}

export function resolveAssetUrl(url: string): string {
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:')
  ) {
    return url;
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  return url;
}

export function drawQrCode(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number
) {
  try {
    const qrFactory =
      typeof qrcode === 'function' ? qrcode : (qrcode as unknown as { default: typeof qrcode }).default;
    const qr = qrFactory(0, 'L');
    qr.addData(text);
    qr.make();
    const count = qr.getModuleCount();
    const cellSize = size / count;

    ctx.save();
    ctx.fillStyle = '#000000';
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(
            x + col * cellSize,
            y + row * cellSize,
            Math.ceil(cellSize),
            Math.ceil(cellSize)
          );
        }
      }
    }
    ctx.restore();
  } catch (err) {
    console.warn('Failed to draw QR code on canvas directly:', err);
    ctx.save();
    roundRectPath(ctx, x, y, size, size, 8);
    ctx.fillStyle = '#f5f3ef';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.stroke();
    ctx.restore();
  }
}

function loadImage(src: string, timeoutMs = 4000): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => {
      img.onload = null;
      img.onerror = null;
      img.src = '';
      reject(
        new Error(`Image load timeout (${timeoutMs}ms): ${src.slice(0, 60)}`)
      );
    }, timeoutMs);

    if (!src.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error(`Failed to load image: ${src.slice(0, 60)}`));
    };
    img.src = src;
  });
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

export function fitFontSize(
  measure: MeasureTextFn,
  text: string,
  maxWidth: number,
  maxSize: number,
  minSize: number
): number {
  let size = maxSize;
  while (size > minSize && measure(text, size) > maxWidth) {
    size -= 1;
  }
  return size;
}

export function wrapTextToWidth(
  measure: MeasureTextFn,
  text: string,
  fontSize: number,
  maxWidth: number
): string[] {
  if (!text) return [];
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const testLine = currentLine + char;
    if (currentLine && measure(testLine, fontSize) > maxWidth) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export function clampWrappedLines(lines: string[], maxLines: number): string[] {
  if (lines.length <= maxLines) return lines;
  const clamped = lines.slice(0, maxLines);
  const last = clamped[maxLines - 1];
  const trimmed = last.replace(/…$/, '');
  clamped[maxLines - 1] =
    trimmed.slice(0, Math.max(1, trimmed.length - 1)) + '…';
  return clamped;
}

export function truncateWithEllipsis(
  measure: MeasureTextFn,
  text: string,
  fontSize: number,
  maxWidth: number
): string {
  if (!text || measure(text, fontSize) <= maxWidth) return text;
  let trimmed = text;
  while (trimmed.length > 1 && measure(`${trimmed}…`, fontSize) > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }
  return `${trimmed}…`;
}

export type DynastyShareCardTextLayout = {
  badgeFontSize: number;
  pillW: number;
  pillH: number;
  heroFontSize: number;
  titleLines: string[];
  titleLineH: number;
  titleH: number;
  descLines: string[];
  descLineH: number;
  descH: number;
  stackH: number;
  stackTop: number;
  gapPillToTitle: number;
  gapTitleToDesc: number;
  gapDescToMeta: number;
  metaH: number;
};

function layoutHeroTitle(
  measureTitle: MeasureTextFn,
  className: string
): Pick<
  DynastyShareCardTextLayout,
  'heroFontSize' | 'titleLines' | 'titleLineH' | 'titleH'
> {
  const minSize = TITLE_FONT_SIZE * 0.7;
  let heroFontSize = TITLE_FONT_SIZE;
  let titleLines: string[] = [];

  while (heroFontSize >= minSize) {
    titleLines = clampWrappedLines(
      wrapTextToWidth(
        measureTitle,
        className,
        heroFontSize,
        TITLE_MAX_WIDTH
      ),
      TITLE_MAX_LINES
    );
    const fits = titleLines.every(
      line => measureTitle(line, heroFontSize) <= TITLE_MAX_WIDTH
    );
    if (fits) break;
    heroFontSize -= 1;
  }

  if (!titleLines.length && className) {
    titleLines = [className];
  }

  const titleLineH = heroFontSize * 1.18;
  const titleH = titleLines.length * titleLineH;

  return { heroFontSize, titleLines, titleLineH, titleH };
}

export function layoutDynastyShareCardText(
  measureBadge: MeasureTextFn,
  measureTitle: MeasureTextFn,
  measureBody: MeasureTextFn,
  input: {
    badgeText: string;
    className: string;
    classDesc: string;
  }
): DynastyShareCardTextLayout {
  const { heroFontSize, titleLines, titleLineH, titleH } = layoutHeroTitle(
    measureTitle,
    input.className
  );

  const badgeFontSize = fitFontSize(
    measureBadge,
    input.badgeText,
    TITLE_MAX_WIDTH - PILL_PAD_X,
    BADGE_FONT_SIZE,
    BADGE_FONT_SIZE * 0.7
  );
  const pillW = Math.min(
    measureBadge(input.badgeText, badgeFontSize) + PILL_PAD_X,
    CARD_WIDTH - TEXT_INSET
  );
  const pillH = badgeFontSize * 1.6;

  let descLines = wrapTextToWidth(
    measureBody,
    input.classDesc,
    DESC_FONT_SIZE,
    DESC_MAX_WIDTH
  );
  descLines = clampWrappedLines(descLines, DESC_MAX_LINES);
  const descLineH = DESC_FONT_SIZE * 1.45;
  const descH = descLines.length * descLineH;
  const metaH = META_FONT_SIZE * 1.2;

  const gapPillToTitle = 4 * CARD_SCALE;
  let gapTitleToDesc = descLines.length ? 4 * CARD_SCALE : 2 * CARD_SCALE;
  let gapDescToMeta = descLines.length ? 4 * CARD_SCALE : 2 * CARD_SCALE;

  let stackH =
    pillH +
    gapPillToTitle +
    titleH +
    gapTitleToDesc +
    descH +
    gapDescToMeta +
    metaH;

  const maxStack = CARD_HEIGHT - 80;
  if (stackH > maxStack) {
    const scale = maxStack / stackH;
    gapTitleToDesc *= scale;
    gapDescToMeta *= scale;
    stackH =
      pillH +
      gapPillToTitle +
      titleH +
      gapTitleToDesc +
      descH +
      gapDescToMeta +
      metaH;
  }

  const stackTop = CARD_Y + (CARD_HEIGHT - stackH) / 2;

  return {
    badgeFontSize,
    pillW,
    pillH,
    heroFontSize,
    titleLines,
    titleLineH,
    titleH,
    descLines,
    descLineH,
    descH,
    stackH,
    stackTop,
    gapPillToTitle,
    gapTitleToDesc,
    gapDescToMeta,
    metaH
  };
}

export type DynastyShareFlavorLayout = {
  lines: string[];
  startY: number;
  lineH: number;
};

export function layoutFlavor(
  measure: MeasureTextFn,
  flavor: string,
  fontSize = 34,
  lineH = FLAVOR_LINE_H
): DynastyShareFlavorLayout {
  const areaTop = CARD_BOTTOM + 16;
  const areaBottom = FOOTER_Y - 20;
  if (!flavor) {
    return { lines: [], startY: areaTop + lineH / 2, lineH };
  }

  const maxBySpace = Math.max(1, Math.floor((areaBottom - areaTop) / lineH));
  const maxLines = Math.min(FLAVOR_MAX_LINES, maxBySpace);
  const lines = clampWrappedLines(
    wrapTextToWidth(measure, flavor, fontSize, FLAVOR_MAX_WIDTH),
    maxLines
  );
  const totalH = lines.length * lineH;
  const bandH = areaBottom - areaTop;
  const top = areaTop + Math.max(0, (bandH - totalH) / 2);
  return { lines, startY: top + lineH / 2, lineH };
}

function canvasMeasure(
  ctx: CanvasRenderingContext2D,
  weight: string
): MeasureTextFn {
  return (text, fontSize) => {
    ctx.font = `${weight} ${fontSize}px ${FONT_FAMILY}`;
    return ctx.measureText(text).width;
  };
}

export function glowRgba(glow: string, alpha: number): string {
  const rgbMatch = glow.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;
  }

  const hex = glow.trim();
  if (hex.startsWith('#')) {
    const raw = hex.slice(1);
    const full =
      raw.length === 3
        ? raw
            .split('')
            .map(ch => ch + ch)
            .join('')
        : raw;
    if (/^[0-9a-fA-F]{6}$/.test(full)) {
      const r = parseInt(full.slice(0, 2), 16);
      const g = parseInt(full.slice(2, 4), 16);
      const b = parseInt(full.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }

  return `rgba(228, 174, 57, ${alpha})`;
}

async function waitForFonts() {
  if (typeof document === 'undefined' || !document.fonts?.ready) return;
  try {
    await document.fonts.ready;
  } catch {
    // ignore font loading errors and draw with fallbacks
  }
}

export async function generateDynastyShareCanvas(
  shareInfo: ShareInfo
): Promise<HTMLCanvasElement> {
  await waitForFonts();

  const canvas = document.createElement('canvas');
  canvas.width = POSTER_WIDTH;
  canvas.height = POSTER_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get 2d context');

  const level = (shareInfo.classLevel ?? DEFAULT_CLASS_LEVEL) as ClassLevel;
  const stampTier = CLASS_STAMPS[level] ?? CLASS_STAMPS[DEFAULT_CLASS_LEVEL];
  const tierVars = dynastyCardVars(level);
  const gender = shareInfo.gender === 'female' ? 'female' : 'male';
  const dynastyName = shareInfo.dynastyName ?? shareInfo.region ?? '未知朝代';
  const className = shareInfo.className ?? shareInfo.category ?? '平民';
  const classDesc = shareInfo.classDesc ?? '';
  const flavor = shareInfo.flavor ?? '';

  // 1. Poster background
  ctx.fillStyle = '#f5f3ef';
  ctx.fillRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT);

  // 2. Eyebrow: 第 N 次投胎
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const eyebrowY = 78;
  const prefix = '第 ';
  const countStr = `${shareInfo.count}`;
  const suffix = ' 次投胎';

  ctx.font = `500 38px ${FONT_FAMILY}`;
  const prefixW = ctx.measureText(prefix).width;
  const suffixW = ctx.measureText(suffix).width;

  ctx.font = `700 42px ${FONT_FAMILY}`;
  const countW = ctx.measureText(countStr).width;

  const totalEyebrowW = prefixW + countW + suffixW;
  let cursorX = (POSTER_WIDTH - totalEyebrowW) / 2;

  ctx.textAlign = 'left';
  ctx.font = `500 38px ${FONT_FAMILY}`;
  ctx.fillStyle = '#1a1a1a';
  ctx.fillText(prefix, cursorX, eyebrowY);
  cursorX += prefixW;

  ctx.font = `700 42px ${FONT_FAMILY}`;
  ctx.fillStyle = '#ba3700';
  ctx.fillText(countStr, cursorX, eyebrowY);
  cursorX += countW;

  ctx.font = `500 38px ${FONT_FAMILY}`;
  ctx.fillStyle = '#1a1a1a';
  ctx.fillText(suffix, cursorX, eyebrowY);

  // 3. Rare Glow behind Card (Tier 1, 2, 3)
  if (level <= 3) {
    const cardCenterX = CARD_X + CARD_WIDTH / 2;
    const cardCenterY = CARD_Y + CARD_HEIGHT / 2;

    ctx.save();
    ctx.translate(cardCenterX, cardCenterY);
    ctx.scale(1, 1.2);
    const glowRadius = CARD_WIDTH * 0.62;
    const glowGrad = ctx.createRadialGradient(0, 0, 40, 0, 0, glowRadius);
    glowGrad.addColorStop(0, glowRgba(stampTier.glow, 0.85));
    glowGrad.addColorStop(0.45, glowRgba(stampTier.glow, 0.35));
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = glowGrad;
    ctx.fillRect(-glowRadius, -glowRadius, glowRadius * 2, glowRadius * 2);
    ctx.restore();
  }

  // 4. Card Outer Shadow & Background
  ctx.save();
  roundRectPath(ctx, CARD_X, CARD_Y, CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS);
  ctx.shadowColor = tierVars['--tier-glow'] || 'rgba(0, 0, 0, 0.22)';
  ctx.shadowBlur = 44;
  ctx.shadowOffsetY = 20;

  const cardBgGrad = ctx.createRadialGradient(
    CARD_X + CARD_WIDTH / 2,
    CARD_Y + CARD_HEIGHT * 0.3,
    0,
    CARD_X + CARD_WIDTH / 2,
    CARD_Y + CARD_HEIGHT * 0.3,
    CARD_HEIGHT * 0.75
  );
  cardBgGrad.addColorStop(0, tierVars['--tier-result-bg'] || '#382e23');
  cardBgGrad.addColorStop(1, '#17120c');

  ctx.fillStyle = cardBgGrad;
  ctx.fill();
  ctx.restore();

  // 5. Card Clip for internal layers (Pattern, Ornament, Gradient wash, Text)
  ctx.save();
  roundRectPath(ctx, CARD_X, CARD_Y, CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS);
  ctx.clip();

  // 5a. Shell pattern (scale tile proportionally so canvas pattern density matches CSS preview)
  try {
    const patternStyle = getShellPatternStyle(shareInfo.dynastyId);
    const match = patternStyle.backgroundImage.match(
      /url\("?(data:image\/svg\+xml[^"]+)"?\)/
    );
    if (match && match[1]) {
      const patternImg = await loadImage(match[1]);
      const patternScale = CARD_WIDTH / RESULT_CARD_CSS_WIDTH;
      const tileW = Math.max(1, Math.round(patternImg.width * patternScale));
      const tileH = Math.max(1, Math.round(patternImg.height * patternScale));

      const tileCanvas = document.createElement('canvas');
      tileCanvas.width = tileW;
      tileCanvas.height = tileH;
      const tileCtx = tileCanvas.getContext('2d');
      if (tileCtx) {
        tileCtx.drawImage(patternImg, 0, 0, tileW, tileH);
        const pattern = ctx.createPattern(tileCanvas, 'repeat');
        if (pattern) {
          ctx.save();
          ctx.globalAlpha = 0.24;
          ctx.fillStyle = pattern;
          ctx.fillRect(CARD_X, CARD_Y, CARD_WIDTH, CARD_HEIGHT);
          ctx.restore();
        }
      }
    }
  } catch (err) {
    console.warn('Could not load shell pattern for share canvas:', err);
  }

  // 5b. Card Bottom Tier Gradient Wash (1:1 replica of CSS .dynasty-card::after)
  const washGrad = ctx.createLinearGradient(
    0,
    CARD_Y + CARD_HEIGHT,
    0,
    CARD_Y
  );
  washGrad.addColorStop(0, tierVars['--tier-wash-88'] || 'rgba(228, 174, 57, 0.88)');
  washGrad.addColorStop(0.24, tierVars['--tier-wash-52'] || 'rgba(228, 174, 57, 0.52)');
  washGrad.addColorStop(0.46, tierVars['--tier-wash-16'] || 'rgba(228, 174, 57, 0.16)');
  washGrad.addColorStop(0.66, 'rgba(0, 0, 0, 0)');
  washGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.save();
  ctx.fillStyle = washGrad;
  ctx.fillRect(CARD_X, CARD_Y, CARD_WIDTH, CARD_HEIGHT);
  ctx.restore();

  // 5c. Shell ornament vector (z-index 2 in CSS, drawn on top of gradient wash)
  try {
    const ornamentSvg = getDynastyOrnamentSvg(shareInfo.dynastyId);
    const ornamentDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(ornamentSvg)}`;
    const ornamentImg = await loadImage(ornamentDataUri);
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.drawImage(ornamentImg, CARD_X, CARD_Y, CARD_WIDTH, CARD_HEIGHT);
    ctx.restore();
  } catch (err) {
    console.warn('Could not load ornament SVG for share canvas:', err);
  }

  // 5d. Bottom tier accent bar (matching CSS .dynasty-card::before)
  ctx.fillStyle = tierVars['--tier-color'] || stampTier.border;
  ctx.fillRect(CARD_X, CARD_Y + CARD_HEIGHT - 8, CARD_WIDTH, 8);

  // 5f. Unified Vertically-Centered Text Stack inside Card (Pill + Title + Desc + Meta)
  const badgeText = `${dynastyName} · ${stampTier.name}`;
  const measureBadge = canvasMeasure(ctx, '800');
  const measureTitle = canvasMeasure(ctx, '900');
  const measureBody = canvasMeasure(ctx, '500');
  const cardText = layoutDynastyShareCardText(measureBadge, measureTitle, measureBody, {
    badgeText,
    className,
    classDesc
  });

  let currentY = cardText.stackTop;

  // 1. Badge Pill
  const pillX = CARD_X + (CARD_WIDTH - cardText.pillW) / 2;
  const pillY = currentY;
  const badgeDisplayText = truncateWithEllipsis(
    measureBadge,
    badgeText,
    cardText.badgeFontSize,
    cardText.pillW - PILL_PAD_X
  );
  ctx.save();
  roundRectPath(ctx, pillX, pillY, cardText.pillW, cardText.pillH, cardText.pillH / 2);
  ctx.fillStyle = tierVars['--tier-stamp-fill'] || 'rgba(240, 197, 90, 0.14)';
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = tierVars['--tier-border'] || stampTier.border;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `800 ${cardText.badgeFontSize}px ${FONT_FAMILY}`;
  ctx.fillStyle = stampTier.text || '#fde68a';
  ctx.fillText(badgeDisplayText, CARD_X + CARD_WIDTH / 2, pillY + cardText.pillH / 2 + 1);
  ctx.restore();

  currentY += cardText.pillH + cardText.gapPillToTitle;

  // 2. Hero Title
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${cardText.heroFontSize}px ${FONT_FAMILY}`;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 3;
  cardText.titleLines.forEach((line, index) => {
    const lineCenterY =
      currentY + cardText.titleLineH / 2 + index * cardText.titleLineH;
    ctx.fillText(line, CARD_X + CARD_WIDTH / 2, lineCenterY);
  });
  ctx.restore();

  currentY += cardText.titleH + cardText.gapTitleToDesc;

  // 3. Class Description
  if (cardText.descLines.length > 0) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `500 ${DESC_FONT_SIZE}px ${FONT_FAMILY}`;
    ctx.fillStyle = '#f3eee3';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;

    cardText.descLines.forEach((line, index) => {
      ctx.fillText(
        line,
        CARD_X + CARD_WIDTH / 2,
        currentY + index * cardText.descLineH + cardText.descLineH / 2
      );
    });
    ctx.restore();
  }

  currentY += cardText.descH + cardText.gapDescToMeta;

  // 4. Meta Line (Gender · Probability)
  const metaCenterY = currentY + cardText.metaH / 2;
  const genderStr = translateDynastyGender(gender);
  const dotStr = ' · ';
  const probStr = `概率 ${formatDynastyProbability(shareInfo.probability)}`;

  ctx.font = `600 ${META_FONT_SIZE}px ${FONT_FAMILY}`;
  const genderW = ctx.measureText(genderStr).width;
  ctx.font = `400 ${META_FONT_SIZE}px ${FONT_FAMILY}`;
  const dotW = ctx.measureText(dotStr).width;
  ctx.font = `800 ${META_FONT_SIZE}px ${FONT_FAMILY}`;
  const probW = ctx.measureText(probStr).width;

  const totalMetaW = genderW + dotW + probW;
  let metaX = CARD_X + (CARD_WIDTH - totalMetaW) / 2;

  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;

  ctx.font = `600 ${META_FONT_SIZE}px ${FONT_FAMILY}`;
  ctx.fillStyle = '#d1c7b8';
  ctx.fillText(genderStr, metaX, metaCenterY);
  metaX += genderW;

  ctx.font = `400 ${META_FONT_SIZE}px ${FONT_FAMILY}`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillText(dotStr, metaX, metaCenterY);
  metaX += dotW;

  ctx.font = `800 ${META_FONT_SIZE}px ${FONT_FAMILY}`;
  ctx.fillStyle = stampTier.text || '#fde68a';
  ctx.fillText(probStr, metaX, metaCenterY);
  ctx.restore();

  // End card clipping
  ctx.restore();

  // Outer card border — draw after clip so the full stroke is visible
  ctx.save();
  roundRectPath(ctx, CARD_X, CARD_Y, CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS);
  ctx.strokeStyle = stampTier.border;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  // 6. Flavor text below card (wrapped, capped so it never hits the footer)
  if (flavor) {
    const flavorLayout = layoutFlavor(measureBody, flavor);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `500 34px ${FONT_FAMILY}`;
    ctx.fillStyle = '#1a1a1a';

    flavorLayout.lines.forEach((line, index) => {
      ctx.fillText(
        line,
        POSTER_WIDTH / 2,
        flavorLayout.startY + index * flavorLayout.lineH
      );
    });
    ctx.restore();
  }

  // 7. Footer: Brand (Left) + QR Code (Right)
  // 7a. Carrot Logo & Brand Text (Primary color #ba3700)
  const brandX = 76;
  const brandY = FOOTER_Y;
  try {
    const carrotImg = await loadImage(resolveAssetUrl(siteIconSmall));
    ctx.drawImage(carrotImg, brandX, brandY, 80, 80);
  } catch (err) {
    console.warn('Could not load carrot icon for share canvas:', err);
  }

  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `700 36px ${FONT_FAMILY}`;
  ctx.fillStyle = '#ba3700';
  ctx.fillText('投胎模拟器', brandX + 96, brandY + 36);

  ctx.font = `500 26px ${FONT_FAMILY}`;
  ctx.fillStyle = '#ba3700';
  ctx.fillText('toutai.online/dynasty', brandX + 96, brandY + 70);
  ctx.restore();

  // 7b. High Resolution QR Code (directly rendered via qrcode-generator, zero DOM scraping)
  const qrSize = 110;
  const qrX = POSTER_WIDTH - 76 - qrSize;
  const qrY = brandY - 14;

  drawQrCode(ctx, DYNASTY_SHARE_URL, qrX, qrY, qrSize);

  return canvas;
}

export async function generateDynastyShareImage(
  shareInfo: ShareInfo
): Promise<Blob> {
  const canvas = await generateDynastyShareCanvas(shareInfo);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(result => {
      if (result) {
        resolve(result);
      } else {
        reject(new Error('Canvas toBlob failed'));
      }
    }, 'image/png');
  });
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read blob as data URL'));
      }
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error('FileReader failed'));
    reader.readAsDataURL(blob);
  });
}
