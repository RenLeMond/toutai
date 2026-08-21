'use client';

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore
} from 'react';
import { createPortal } from 'react-dom';
import { Text, View } from 'reshaped';
import {
  CLASS_STAMPS,
  ClassLevel,
  DynastyBirthResult
} from '@/lib/dynasty-rebirth';
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  SPIN_START_OFFSET,
  STEP,
  StripItem,
  buildIdleStrip,
  buildStrip,
  getCenteredIndex,
  getLandingSchedule,
  getOffsetForIndex,
  getSpinConfig,
  getSpinKeyframes
} from '@/lib/dynasty-spin';
import { DynastyCardShell } from '@/components/dynasty-card-shell';
import { DynastyResultCard } from '@/components/dynasty-result-card';
import { dynastyCardVars } from '@/lib/dynasty-card-style';
import './dynasty-flip-card.css';

export interface DynastyRevealPayload {
  seq: number;
  result: DynastyBirthResult;
  isNew?: boolean;
}

interface DynastyFlipCardProps {
  result: DynastyBirthResult | null;
  reveal: DynastyRevealPayload | null;
  disabled?: boolean;
  onClick?: () => void;
  onRevealComplete?: (result: DynastyBirthResult, seq: number) => void;
}

type Phase = 'prompt' | 'spinning' | 'revealed';
type RareLevel = 1 | 2 | 3;

interface FxRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Longest animation duration + delay per tier, with a short teardown buffer. */
const RARE_SHINE_MS: Record<RareLevel, number> = {
  1: 3000,
  2: 2200,
  3: 1850
};

function isRareLevel(level: ClassLevel): level is RareLevel {
  return level <= 3;
}

function readWinnerFxRect(el: HTMLDivElement | null): FxRect | null {
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height
  };
}

function sameFxRect(a: FxRect | null, b: FxRect | null) {
  if (!a || !b) return a === b;
  return (
    a.left === b.left &&
    a.top === b.top &&
    a.width === b.width &&
    a.height === b.height
  );
}

function CardSweepFx({ level }: { level: RareLevel }) {
  return (
    <>
      {level === 1 ? <div className="rare-shine-foil" /> : null}
      {level === 2 ? <div className="rare-shine-slash" /> : null}
      {level === 3 ? <div className="rare-shine-ribbon" /> : null}
      <div className="rare-shine-flash" />
    </>
  );
}

function RareShineBack({ level }: { level: RareLevel }) {
  return (
    <>
      <div className="rare-shine-aura" />
      {level === 3 ? (
        <>
          <div className="rare-shine-seal" />
          <div className="rare-shine-seal rare-shine-seal-2" />
        </>
      ) : (
        <div className="rare-shine-burst" />
      )}
    </>
  );
}

function RareShineFront() {
  return (
    <div className="rare-shine-sparkles">
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} className="rare-shine-spark" />
      ))}
    </div>
  );
}

function RareShineScreen({
  level,
  rect
}: {
  level: RareLevel;
  rect: FxRect;
}) {
  const holeW = rect.width * 1.16;
  const holeH = rect.height * 1.16;

  return (
    <div
      className={`rare-shine-screen rare-l${level}`}
      style={
        {
          '--fx-left': `${rect.left}px`,
          '--fx-top': `${rect.top}px`,
          '--fx-width': `${rect.width}px`,
          '--fx-height': `${rect.height}px`,
          '--fx-hole-w': `${holeW}px`,
          '--fx-hole-h': `${holeH}px`
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <div className="rare-shine-origin">
        <RareShineBack level={level} />
        <RareShineFront />
      </div>
    </div>
  );
}

function PreviewCard({
  dynastyId,
  dynastyName,
  classLevel,
  rareFx
}: {
  dynastyId?: string;
  dynastyName: string;
  classLevel: ClassLevel;
  rareFx?: RareLevel;
}) {
  return (
    <div
      className={`dynasty-card is-preview tier-${classLevel}`}
      style={dynastyCardVars(classLevel)}
    >
      <DynastyCardShell dynastyId={dynastyId} />
      <div className="dynasty-preview-inner">
        <p className="dynasty-preview-title">{dynastyName}</p>
      </div>
      {rareFx ? <CardSweepFx level={rareFx} /> : null}
    </div>
  );
}

function FlipCard({
  result,
  flipped,
  rareFx,
  isNew = false
}: {
  result: DynastyBirthResult;
  flipped: boolean;
  rareFx?: RareLevel;
  isNew?: boolean;
}) {
  return (
    <div className={`dynasty-flipper ${flipped ? 'is-flipped' : ''}`}>
      <div className="dynasty-flipper-inner">
        <div className="dynasty-face dynasty-face-front">
          <PreviewCard
            dynastyId={result.dynastyId}
            dynastyName={result.dynastyName}
            classLevel={result.classLevel}
            rareFx={rareFx}
          />
        </div>
        <div className="dynasty-face dynasty-face-back">
          <DynastyResultCard
            dynastyId={result.dynastyId}
            dynastyName={result.dynastyName}
            className={result.className}
            classLevel={result.classLevel}
            classDesc={result.classDesc}
            gender={result.gender}
            probability={result.probability}
            isNew={isNew}
          />
        </div>
      </div>
    </div>
  );
}

const DynastyFlipCard = ({
  result,
  reveal,
  disabled = false,
  onClick,
  onRevealComplete
}: DynastyFlipCardProps) => {
    const stripRef = useRef<HTMLDivElement>(null);
    const winnerSlotRef = useRef<HTMLDivElement>(null);
    const offsetRef = useRef(0);
    const animRef = useRef<Animation | null>(null);
    const spinTimerRef = useRef<number | null>(null);
    const beatTimersRef = useRef<number[]>([]);
    const rareShineTimerRef = useRef<number | null>(null);
    const passingRafRef = useRef<number | null>(null);
    const completedRef = useRef(false);
    const finalToRef = useRef(0);
    const passingIndexRef = useRef(-1);
    const onRevealCompleteRef = useRef(onRevealComplete);

    useEffect(() => {
      onRevealCompleteRef.current = onRevealComplete;
    }, [onRevealComplete]);

    const [displayResult, setDisplayResult] = useState<DynastyBirthResult | null>(
      result
    );
    const [phase, setPhase] = useState<Phase>(result ? 'revealed' : 'prompt');
    const [stripItems, setStripItems] = useState<StripItem[]>(() =>
      result ? buildStrip(result, 0).items : []
    );
    const [winIndex, setWinIndex] = useState(() =>
      result ? buildStrip(result, 0).winIndex : 0
    );
    const [stripOffset, setStripOffset] = useState(() => {
      if (!result) return 0;
      return getOffsetForIndex(buildStrip(result, 0).winIndex);
    });
    const [showPopFx, setShowPopFx] = useState(false);
    const [popped, setPopped] = useState(Boolean(result));
    const [rareShineLevel, setRareShineLevel] = useState<RareLevel | null>(null);
    const [rareShinePlayId, setRareShinePlayId] = useState(0);
    const [fxRect, setFxRect] = useState<FxRect | null>(null);
    // Client-only portal target; subscribe noop because mount state never changes.
    const portalMounted = useSyncExternalStore(
      () => () => {},
      () => true,
      () => false
    );
    const [flipped, setFlipped] = useState(Boolean(result));
    const [syncedSeq, setSyncedSeq] = useState<number | null>(null);
    const [winnerIsNew, setWinnerIsNew] = useState(false);
    const idleItems = useMemo(() => buildIdleStrip(8), []);
    const idleLoopItems = useMemo(
      () => [...idleItems, ...idleItems.map(item => ({ ...item, key: `${item.key}-dup` }))],
      [idleItems]
    );

    if (reveal && syncedSeq !== reveal.seq) {
      const { items, winIndex: nextWinIndex } = buildStrip(
        reveal.result,
        reveal.seq
      );
      const reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const to = getOffsetForIndex(nextWinIndex);

      setSyncedSeq(reveal.seq);
      setWinnerIsNew(Boolean(reveal.isNew));
      setStripItems(items);
      setWinIndex(nextWinIndex);
      setDisplayResult(reveal.result);
      setShowPopFx(false);
      setPopped(reducedMotion);
      setRareShineLevel(null);
      setFxRect(null);
      setFlipped(reducedMotion);
      setPhase(reducedMotion ? 'revealed' : 'spinning');
      setStripOffset(reducedMotion ? to : SPIN_START_OFFSET);
    }

    const stopPassingTick = () => {
      if (passingRafRef.current) {
        cancelAnimationFrame(passingRafRef.current);
        passingRafRef.current = null;
      }
    };

    const clearBeatTimers = () => {
      beatTimersRef.current.forEach(id => window.clearTimeout(id));
      beatTimersRef.current = [];
    };

    const clearRareShineTimer = () => {
      if (rareShineTimerRef.current) {
        window.clearTimeout(rareShineTimerRef.current);
        rareShineTimerRef.current = null;
      }
    };

    const scheduleBeat = (fn: () => void, ms: number) => {
      beatTimersRef.current.push(window.setTimeout(fn, ms));
    };

    const startPassingTick = () => {
      stopPassingTick();
      passingIndexRef.current = -1;

      const tick = () => {
        const strip = stripRef.current;
        if (!strip) return;

        const transform = getComputedStyle(strip).transform;
        if (transform && transform !== 'none') {
          const tx = new DOMMatrix(transform).m41;
          const nextIndex = Math.max(
            0,
            Math.min(strip.childElementCount - 1, getCenteredIndex(tx))
          );

          if (nextIndex !== passingIndexRef.current) {
            strip.children[passingIndexRef.current]?.classList.remove(
              'is-passing'
            );
            strip.children[nextIndex]?.classList.add('is-passing');
            passingIndexRef.current = nextIndex;
          }
        }

        passingRafRef.current = requestAnimationFrame(tick);
      };

      passingRafRef.current = requestAnimationFrame(tick);
    };

    const settle = (
      resultToCommit: DynastyBirthResult,
      seq: number,
      options?: { instantDetails?: boolean; pop?: boolean }
    ) => {
      if (completedRef.current) return;
      completedRef.current = true;

      stopPassingTick();
      if (stripRef.current) {
        stripRef.current
          .querySelector('.is-passing')
          ?.classList.remove('is-passing');
      }
      clearBeatTimers();
      clearRareShineTimer();

      const to = finalToRef.current;
      offsetRef.current = to;
      if (stripRef.current) {
        stripRef.current.style.transform = `translate3d(${to}px, 0, 0)`;
      }
      setStripOffset(to);
      setPhase('revealed');

      const skipCeremony =
        Boolean(options?.instantDetails) || !options?.pop;
      const beats = getLandingSchedule(resultToCommit.classLevel, skipCeremony);

      if (skipCeremony) {
        setShowPopFx(false);
        setPopped(true);
        setFlipped(true);
        setRareShineLevel(null);
        setFxRect(null);
        onRevealCompleteRef.current?.(resultToCommit, seq);
        return;
      }

      setShowPopFx(false);
      setPopped(false);
      setFlipped(false);
      setRareShineLevel(null);
      setFxRect(null);

      scheduleBeat(() => {
        setShowPopFx(true);
        if (!isRareLevel(resultToCommit.classLevel)) return;

        const level = resultToCommit.classLevel;
        setRareShineLevel(level);
        setRareShinePlayId(id => id + 1);
        rareShineTimerRef.current = window.setTimeout(() => {
          setRareShineLevel(null);
          setFxRect(null);
        }, RARE_SHINE_MS[level]);
      }, beats.popAt);

      scheduleBeat(() => {
        setShowPopFx(false);
        setPopped(true);
      }, beats.poppedAt);

      scheduleBeat(() => {
        setFlipped(true);
      }, beats.flipAt);

      scheduleBeat(() => {
        onRevealCompleteRef.current?.(resultToCommit, seq);
      }, beats.completeAt);
    };

    const runSpin = (
      strip: HTMLDivElement,
      resultToCommit: DynastyBirthResult,
      seq: number,
      from: number,
      to: number
    ) => {
      const config = getSpinConfig();
      const totalMs = config.duration + config.tickMs;
      const frames = getSpinKeyframes(from, to, {
        overshootRatio: config.overshootRatio,
        tickPortion: totalMs > 0 ? config.tickMs / totalMs : 0
      });

      const animation = strip.animate(frames, {
        duration: Math.max(1, totalMs),
        easing: 'linear',
        fill: 'forwards'
      });

      animRef.current = animation;
      animation.onfinish = () => {
        if (animRef.current !== animation) return;
        offsetRef.current = to;
        settle(resultToCommit, seq, { pop: true });
      };
    };

    useLayoutEffect(() => {
      if (!reveal) return;

      const { winIndex: nextWinIndex } = buildStrip(reveal.result, reveal.seq);
      const to = getOffsetForIndex(nextWinIndex);
      const startOffset = SPIN_START_OFFSET;
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      completedRef.current = false;
      finalToRef.current = to;
      offsetRef.current = reducedMotion ? to : startOffset;
      clearRareShineTimer();

      if (reducedMotion) {
        const previous = animRef.current;
        animRef.current = null;
        previous?.cancel();
        completedRef.current = true;
        onRevealCompleteRef.current?.(reveal.result, reveal.seq);
        return;
      }

      const resultToCommit = reveal.result;
      const seq = reveal.seq;
      const landingTo = finalToRef.current;

      const beginSpin = () => {
        const strip = stripRef.current;
        if (!strip) {
          settle(resultToCommit, seq, { instantDetails: true, pop: false });
          return;
        }

        strip.style.transform = `translate3d(${startOffset}px, 0, 0)`;
        startPassingTick();
        runSpin(strip, resultToCommit, seq, startOffset, landingTo);
      };

      spinTimerRef.current = window.setTimeout(beginSpin, 0);

      return () => {
        if (spinTimerRef.current) window.clearTimeout(spinTimerRef.current);
        const previous = animRef.current;
        animRef.current = null;
        previous?.cancel();
        stopPassingTick();
        clearBeatTimers();
        clearRareShineTimer();
      };
      // Animation is driven by the reveal token.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reveal]);

    useEffect(() => {
      return () => {
        animRef.current?.cancel();
        if (spinTimerRef.current) window.clearTimeout(spinTimerRef.current);
        clearBeatTimers();
        clearRareShineTimer();
        if (passingRafRef.current) cancelAnimationFrame(passingRafRef.current);
      };
    }, []);

    useLayoutEffect(() => {
      if (!rareShineLevel) return;

      let frame = 0;
      const commitRect = () => {
        const next = readWinnerFxRect(winnerSlotRef.current);
        if (!next) return;
        setFxRect(prev => (sameFxRect(prev, next) ? prev : next));
      };

      const onViewportChange = () => {
        if (frame) return;
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          commitRect();
        });
      };

      commitRect();
      window.addEventListener('resize', onViewportChange);
      window.addEventListener('scroll', onViewportChange, true);
      window.visualViewport?.addEventListener('resize', onViewportChange);
      window.visualViewport?.addEventListener('scroll', onViewportChange);

      return () => {
        window.removeEventListener('resize', onViewportChange);
        window.removeEventListener('scroll', onViewportChange, true);
        window.visualViewport?.removeEventListener('resize', onViewportChange);
        window.visualViewport?.removeEventListener('scroll', onViewportChange);
        if (frame) cancelAnimationFrame(frame);
      };
    }, [rareShineLevel, rareShinePlayId]);

    const active = displayResult ?? result;
    const stampTier = active ? CLASS_STAMPS[active.classLevel] : null;
    const landing = active ? getLandingSchedule(active.classLevel) : null;
    const showIdleLoop = phase === 'prompt' && !active;
    const showStrip = stripItems.length > 0 && !showIdleLoop;

    const sceneClass = [
      'csgo-scene',
      showIdleLoop ? 'is-idle' : '',
      phase === 'revealed' && active ? 'is-revealed' : '',
      phase === 'revealed' && active ? `tier-${active.classLevel}` : '',
      phase === 'spinning' ? 'is-spinning' : '',
      showPopFx ? 'is-popping' : '',
      popped && phase === 'revealed' ? 'is-popped' : '',
      rareShineLevel ? 'is-rare-shining' : ''
    ]
      .filter(Boolean)
      .join(' ');

    const rareShinePortal =
      portalMounted &&
      rareShineLevel &&
      fxRect &&
      createPortal(
        <RareShineScreen
          key={rareShinePlayId}
          level={rareShineLevel}
          rect={fxRect}
        />,
        document.body
      );

    return (
      <>
      {rareShinePortal}
      <button
        type="button"
        className={sceneClass}
        disabled={disabled}
        onClick={onClick}
        aria-label={disabled || phase === 'spinning' ? '开投中' : '抽卡投胎'}
        style={
          {
            '--csgo-card-width': `${CARD_WIDTH}px`,
            '--csgo-card-height': `${CARD_HEIGHT}px`,
            '--dynasty-flip-ms': `${landing?.flip ?? 550}ms`,
            '--csgo-pop-ms': `${landing?.pop || 350}ms`,
            ...(stampTier && phase === 'revealed'
              ? {
                  '--tier-color': stampTier.border,
                  '--tier-text': stampTier.text,
                  '--tier-glow': stampTier.glow
                }
              : {})
          } as React.CSSProperties
        }
      >
        <div className="csgo-track">
          <div className="csgo-vignette csgo-vignette-left" aria-hidden="true" />
          <div className="csgo-vignette csgo-vignette-right" aria-hidden="true" />
          <div className="csgo-selector" aria-hidden="true" />
          {showPopFx && <div className="csgo-pop-flash" aria-hidden="true" />}

          {showIdleLoop && (
            <div
              className="csgo-strip csgo-idle-strip"
              style={
                {
                  '--idle-loop-width': `${idleItems.length * STEP}px`
                } as React.CSSProperties
              }
              aria-hidden="true"
            >
              {idleLoopItems.map(item => (
                <div key={item.key} className="csgo-slot csgo-idle-slot">
                  <PreviewCard
                    dynastyId={item.dynastyId}
                    dynastyName={item.dynastyName}
                    classLevel={item.classLevel}
                  />
                </div>
              ))}
            </div>
          )}

          {showStrip && (
            <div
              ref={stripRef}
              className="csgo-strip"
              style={{ transform: `translate3d(${stripOffset}px, 0, 0)` }}
            >
              {stripItems.map((item, index) => {
                const isWinner =
                  phase === 'revealed' &&
                  index === winIndex &&
                  item.kind === 'winner';
                const isDimmed = phase === 'revealed' && !isWinner;

                const shineLevel =
                  isWinner && rareShineLevel && item.kind === 'winner'
                    ? rareShineLevel
                    : null;

                if (item.kind === 'winner') {
                  return (
                    <div
                      key={item.key}
                      ref={isWinner ? winnerSlotRef : undefined}
                      className={`csgo-slot ${isWinner ? 'is-winner' : ''} ${isDimmed ? 'is-dimmed' : ''} ${shineLevel ? `is-rare-playing rare-l${shineLevel}` : ''}`}
                    >
                      <FlipCard
                        result={item.result}
                        flipped={isWinner && flipped}
                        rareFx={shineLevel ?? undefined}
                        isNew={winnerIsNew}
                      />
                    </div>
                  );
                }

                return (
                  <div
                    key={item.key}
                    className={`csgo-slot ${isDimmed ? 'is-dimmed' : ''}`}
                  >
                    <PreviewCard
                      dynastyId={item.dynastyId}
                      dynastyName={item.dynastyName}
                      classLevel={item.classLevel}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {showIdleLoop && (
            <div className="csgo-idle-hint">
              <Text variant="body-2" color="neutral-faded" align="center">
                点击开投
              </Text>
            </div>
          )}
        </div>
      </button>
      </>
    );
};

export default DynastyFlipCard;
