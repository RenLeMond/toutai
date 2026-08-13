import {
  ClassLevel,
  DynastyBirthResult,
  dynasties
} from '@/lib/dynasty-rebirth';

export const CARD_WIDTH = 200;
export const CARD_HEIGHT = Math.round(CARD_WIDTH * (7 / 5));
const CARD_GAP = 12;
export const STEP = CARD_WIDTH + CARD_GAP;
export const WIN_INDEX_BASE = 48;
export const STRIP_TAIL = 8;
export const SPIN_START_OFFSET = 0;
export const SPIN_EASE_POWER = 2.6;
export const SPIN_KEYFRAME_STEPS = 64;

export interface SpinKeyframe {
  transform: string;
  offset: number;
}

export type SpinTier = 'rapid' | 'normal';

export interface SpinConfig {
  duration: number;
  overshootRatio: number;
  tickMs: number;
}

export interface DecoyItem {
  key: string;
  kind: 'decoy';
  dynastyId: string;
  dynastyName: string;
  className: string;
  classLevel: ClassLevel;
}

export interface WinnerItem {
  key: string;
  kind: 'winner';
  result: DynastyBirthResult;
}

export type StripItem = DecoyItem | WinnerItem;

export function getSpinConfig(tier: SpinTier = 'normal'): SpinConfig {
  if (tier === 'rapid') {
    return {
      duration: 320,
      overshootRatio: 0,
      tickMs: 0
    };
  }

  return {
    duration: 2720,
    overshootRatio: 0.18,
    tickMs: 580
  };
}

/** 先从静止加速，再可读巡航，最后把刹车拉长，停稳更自然。 */
export function spinProgress(t: number) {
  const x = Math.min(1, Math.max(0, t));
  const accelEnd = 0.14;
  const accelDist = 0.1;
  const cruiseEnd = 0.52;
  const cruiseDist = 0.58;

  if (x < accelEnd) {
    const u = x / accelEnd;
    return accelDist * u * u;
  }

  if (x < cruiseEnd) {
    const u = (x - accelEnd) / (cruiseEnd - accelEnd);
    return accelDist + cruiseDist * u;
  }

  const u = (x - cruiseEnd) / (1 - cruiseEnd);
  return (
    accelDist + cruiseDist + (1 - accelDist - cruiseDist) * (1 - (1 - u) ** SPIN_EASE_POWER)
  );
}

export function getSpinKeyframes(
  from: number,
  to: number,
  options?: {
    steps?: number;
    overshootRatio?: number;
    tickPortion?: number;
  }
): SpinKeyframe[] {
  const steps = options?.steps ?? SPIN_KEYFRAME_STEPS;
  const overshootRatio = options?.overshootRatio ?? 0;
  const tickPortion = options?.tickPortion ?? 0.14;
  const overshoot =
    overshootRatio > 0 ? getOvershootOffset(to, overshootRatio) : to;
  const cruiseEnd = overshootRatio > 0 ? 1 - tickPortion : 1;
  const frames: SpinKeyframe[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    let x: number;

    if (t <= cruiseEnd) {
      const u = cruiseEnd === 0 ? 1 : Math.min(1, t / cruiseEnd);
      x = from + (overshoot - from) * spinProgress(u);
    } else {
      const u = (t - cruiseEnd) / Math.max(0.0001, 1 - cruiseEnd);
      const s = u * u * (3 - 2 * u);
      x = overshoot + (to - overshoot) * s;
    }

    frames.push({
      transform: `translate3d(${x}px, 0, 0)`,
      offset: t
    });
  }

  return frames;
}

export function getOffsetForIndex(index: number) {
  return -(index * STEP);
}

export function getCenteredIndex(translateX: number) {
  return Math.round(-translateX / STEP);
}

function getOvershootOffset(to: number, overshootRatio: number) {
  return to - STEP * overshootRatio;
}

function unitFromSeed(seed: number) {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function mixSeed(index: number, seq: number, salt: number) {
  return (
    (Math.imul(index + 1, 2654435761) ^
      Math.imul(seq + 1, 1597334677) ^
      salt) >>>
    0
  );
}

function pickWeightedClass(
  classes: { name: string; level: ClassLevel; prob: number }[],
  unit: number
) {
  const totalWeight = classes.reduce((sum, cls) => sum + cls.prob, 0);
  let cursor = unit * totalWeight;

  for (const cls of classes) {
    if (cursor < cls.prob) return cls;
    cursor -= cls.prob;
  }

  return classes[classes.length - 1];
}

export function pickDecoy(index: number, seq: number) {
  const dynastyIndex = Math.floor(
    unitFromSeed(mixSeed(index, seq, 0x9e3779b9)) * dynasties.length
  );
  const dynasty = dynasties[dynastyIndex] ?? dynasties[0];
  const cls = pickWeightedClass(
    dynasty.classes,
    unitFromSeed(mixSeed(index, seq, 0x85ebca6b))
  );

  return {
    dynastyId: dynasty.id,
    dynastyName: dynasty.name,
    className: cls.name,
    classLevel: cls.level as ClassLevel
  };
}

function pickTeaseDecoy(index: number, seq: number) {
  const dynastyIndex = Math.floor(
    unitFromSeed(mixSeed(index, seq, 0x27d4eb2f)) * dynasties.length
  );
  const dynasty = dynasties[dynastyIndex] ?? dynasties[0];
  const rares = dynasty.classes.filter(cls => cls.level <= 3);
  const pool = rares.length > 0 ? rares : dynasty.classes;
  const cls =
    pool[Math.floor(unitFromSeed(mixSeed(index, seq, 0x165667b1)) * pool.length)];

  return {
    dynastyId: dynasty.id,
    dynastyName: dynasty.name,
    className: cls.name,
    classLevel: cls.level as ClassLevel
  };
}

export function buildStrip(result: DynastyBirthResult, seq: number) {
  const winIndex = WIN_INDEX_BASE + (seq % 6);
  const teaseIndex = winIndex - (1 + (seq % 2));
  const total = winIndex + STRIP_TAIL;
  const items: StripItem[] = [];

  for (let i = 0; i < total; i++) {
    if (i === winIndex) {
      items.push({ key: `w-${seq}`, kind: 'winner', result });
    } else if (i === teaseIndex) {
      items.push({
        key: `t-${seq}-${i}`,
        kind: 'decoy',
        ...pickTeaseDecoy(i, seq)
      });
    } else {
      items.push({
        key: `d-${seq}-${i}`,
        kind: 'decoy',
        ...pickDecoy(i, seq)
      });
    }
  }

  return { items, winIndex };
}

export function buildIdleStrip(count = 8) {
  return Array.from({ length: count }, (_, index) => ({
    key: `idle-${index}`,
    ...pickDecoy(index, 0)
  }));
}
