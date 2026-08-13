'use client';

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Text, View } from 'reshaped';
import {
  CLASS_STAMPS,
  ClassLevel,
  DynastyBirthResult,
  formatDynastyProbability,
  translateDynastyGender
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
  getOffsetForIndex,
  getSpinConfig,
  getSpinKeyframes
} from '@/lib/dynasty-spin';
import {
  DynastyCardShell,
  DynastyPatternDefs
} from '@/components/dynasty-card-shell';
import './dynasty-flip-card.css';

export interface DynastyRevealPayload {
  seq: number;
  result: DynastyBirthResult;
  rapid?: boolean;
}

interface DynastyFlipCardProps {
  result: DynastyBirthResult | null;
  reveal: DynastyRevealPayload | null;
  onClick?: () => void;
  onRevealComplete?: (result: DynastyBirthResult, seq: number) => void;
}

type Phase = 'prompt' | 'spinning' | 'revealed';
type RareLevel = 1 | 2 | 3;

const RARE_SHINE_MS: Record<RareLevel, number> = {
  1: 3000,
  2: 2100,
  3: 1700
};

function isRareLevel(level: ClassLevel): level is RareLevel {
  return level <= 3;
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

function RareShineOuter({ level }: { level: RareLevel }) {
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
      <div className="rare-shine-sparkles">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="rare-shine-spark" />
        ))}
      </div>
    </>
  );
}

function cardStyle(classLevel: ClassLevel): React.CSSProperties {
  const tier = CLASS_STAMPS[classLevel];
  return {
    '--tier-color': tier.border,
    '--tier-text': tier.text,
    '--tier-glow': tier.glow
  } as React.CSSProperties;
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
  const stampTier = CLASS_STAMPS[classLevel];

  return (
    <div
      className={`dynasty-card is-preview tier-${classLevel}`}
      style={cardStyle(classLevel)}
    >
      <DynastyCardShell dynastyId={dynastyId} />
      <View gap={3} padding={4} height="100%" justify="center" align="center">
        <p className="dynasty-card-title">{dynastyName}</p>
        <span className="dynasty-stamp">{stampTier.name}</span>
      </View>
      {rareFx ? <CardSweepFx level={rareFx} /> : null}
    </div>
  );
}

function ResultFace({
  active,
  rareFx
}: {
  active: DynastyBirthResult;
  rareFx?: RareLevel;
}) {
  const stampTier = CLASS_STAMPS[active.classLevel];

  return (
    <div
      className={`dynasty-card is-result tier-${active.classLevel}`}
      style={cardStyle(active.classLevel)}
    >
      <DynastyCardShell dynastyId={active.dynastyId} />
      <View className="dynasty-result-inner" gap={1} height="100%" justify="center">
        <Text
          variant="featured-3"
          weight="medium"
          align="center"
          className="dynasty-card-title"
        >
          {active.dynastyName}
        </Text>
        <View align="center">
          <span className="dynasty-stamp">{stampTier.name}</span>
        </View>
        <Text variant="caption-1" weight="medium" align="center" className="dynasty-card-class">
          {active.className}
        </Text>
        <div className="dynasty-details">
          <Text variant="caption-2" color="neutral-faded" align="center">
            {translateDynastyGender(active.gender)}
          </Text>
          <Text variant="caption-1" align="center" className="dynasty-desc">
            {active.classDesc}
          </Text>
          <Text variant="caption-1" align="center" className="dynasty-prob">
            概率 {formatDynastyProbability(active.probability)}
          </Text>
        </div>
      </View>
      {rareFx ? <CardSweepFx level={rareFx} /> : null}
    </div>
  );
}

function FlipCard({
  result,
  flipped,
  rareFx
}: {
  result: DynastyBirthResult;
  flipped: boolean;
  rareFx?: RareLevel;
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
          <ResultFace active={result} rareFx={rareFx} />
        </div>
      </div>
    </div>
  );
}

const DynastyFlipCard = ({
  result,
  reveal,
  onClick,
  onRevealComplete
}: DynastyFlipCardProps) => {
    const stripRef = useRef<HTMLDivElement>(null);
    const offsetRef = useRef(0);
    const animRef = useRef<Animation | null>(null);
    const spinTimerRef = useRef<number | null>(null);
    const detailsTimerRef = useRef<number | null>(null);
    const rareShineTimerRef = useRef<number | null>(null);
    const passingRafRef = useRef<number | null>(null);
    const completedRef = useRef(false);
    const finalToRef = useRef(0);
    const resultRef = useRef<DynastyBirthResult | null>(null);
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
    const [rareShineLevel, setRareShineLevel] = useState<RareLevel | null>(null);
    const [rareShinePlayId, setRareShinePlayId] = useState(0);
    const [flipped, setFlipped] = useState(Boolean(result));
    const [syncedSeq, setSyncedSeq] = useState<number | null>(null);
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
      setStripItems(items);
      setWinIndex(nextWinIndex);
      setDisplayResult(reveal.result);
      setShowPopFx(false);
      setRareShineLevel(null);
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
      if (detailsTimerRef.current) window.clearTimeout(detailsTimerRef.current);

      const to = finalToRef.current;
      offsetRef.current = to;
      if (stripRef.current) {
        stripRef.current.style.transform = `translate3d(${to}px, 0, 0)`;
      }
      setStripOffset(to);
      setPhase('revealed');
      setShowPopFx(Boolean(options?.pop));
      setFlipped(Boolean(options?.instantDetails));

      if (rareShineTimerRef.current) {
        window.clearTimeout(rareShineTimerRef.current);
        rareShineTimerRef.current = null;
      }

      if (options?.pop && isRareLevel(resultToCommit.classLevel)) {
        const level = resultToCommit.classLevel;
        setRareShineLevel(level);
        setRareShinePlayId(id => id + 1);
        rareShineTimerRef.current = window.setTimeout(() => {
          setRareShineLevel(null);
        }, RARE_SHINE_MS[level]);
      } else {
        setRareShineLevel(null);
      }

      if (options?.pop) {
        window.setTimeout(() => setShowPopFx(false), 400);
      }

      if (!options?.instantDetails) {
        detailsTimerRef.current = window.setTimeout(() => {
          setFlipped(true);
        }, 90);
      }

      onRevealCompleteRef.current?.(resultToCommit, seq);
    };

    const runSpin = (
      strip: HTMLDivElement,
      resultToCommit: DynastyBirthResult,
      seq: number,
      from: number,
      to: number,
      rapid: boolean
    ) => {
      const config = getSpinConfig(rapid ? 'rapid' : 'normal');
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
        settle(resultToCommit, seq, {
          instantDetails: rapid,
          pop: !rapid
        });
      };
    };

    useLayoutEffect(() => {
      if (!reveal) return;

      const { winIndex: nextWinIndex } = buildStrip(reveal.result, reveal.seq);
      const to = getOffsetForIndex(nextWinIndex);
      const startOffset = SPIN_START_OFFSET;
      const rapid = Boolean(reveal.rapid);
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      completedRef.current = false;
      finalToRef.current = to;
      resultRef.current = reveal.result;
      offsetRef.current = reducedMotion ? to : startOffset;

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
        if (!rapid) startPassingTick();
        runSpin(strip, resultToCommit, seq, startOffset, landingTo, rapid);
      };

      spinTimerRef.current = window.setTimeout(beginSpin, 0);

      return () => {
        if (spinTimerRef.current) window.clearTimeout(spinTimerRef.current);
        const previous = animRef.current;
        animRef.current = null;
        previous?.cancel();
        stopPassingTick();
      };
      // Animation is driven by the reveal token.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reveal]);

    useEffect(() => {
      return () => {
        animRef.current?.cancel();
        if (spinTimerRef.current) window.clearTimeout(spinTimerRef.current);
        if (detailsTimerRef.current) window.clearTimeout(detailsTimerRef.current);
        if (rareShineTimerRef.current) window.clearTimeout(rareShineTimerRef.current);
        if (passingRafRef.current) cancelAnimationFrame(passingRafRef.current);
      };
    }, []);

    const active = displayResult ?? result;
    const stampTier = active ? CLASS_STAMPS[active.classLevel] : null;
    const showIdleLoop = phase === 'prompt' && !active;
    const showStrip = stripItems.length > 0 && !showIdleLoop;

    const sceneClass = [
      'csgo-scene',
      showIdleLoop ? 'is-idle' : '',
      phase === 'revealed' && active ? 'is-revealed' : '',
      phase === 'revealed' && active ? `tier-${active.classLevel}` : '',
      phase === 'spinning' ? 'is-spinning' : '',
      showPopFx ? 'is-popping' : '',
      rareShineLevel ? 'is-rare-shining' : ''
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        type="button"
        className={sceneClass}
        onClick={onClick}
        aria-label={phase === 'spinning' ? '开投中，再次点击可连抽' : '抽卡投胎'}
        style={
          {
            '--csgo-card-width': `${CARD_WIDTH}px`,
            '--csgo-card-height': `${CARD_HEIGHT}px`,
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
        <DynastyPatternDefs />
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
                const rarePop =
                  isWinner &&
                  item.kind === 'winner' &&
                  item.result.classLevel <= 3;

                const shineLevel =
                  isWinner && rareShineLevel && item.kind === 'winner'
                    ? rareShineLevel
                    : null;

                if (item.kind === 'winner') {
                  return (
                    <div
                      key={item.key}
                      className={`csgo-slot ${isWinner ? 'is-winner' : ''} ${isDimmed ? 'is-dimmed' : ''} ${rarePop ? 'is-rare' : ''} ${shineLevel ? `is-rare-playing rare-l${shineLevel}` : ''}`}
                    >
                      {shineLevel ? (
                        <RareShineOuter key={rareShinePlayId} level={shineLevel} />
                      ) : null}
                      <FlipCard
                        result={item.result}
                        flipped={isWinner && flipped}
                        rareFx={shineLevel ?? undefined}
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
    );
};

export default DynastyFlipCard;
