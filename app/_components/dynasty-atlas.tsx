'use client';

import React, { useMemo, useState } from 'react';
import { Text, View } from 'reshaped';
import {
  CLASS_STAMPS,
  ClassLevel,
  DYNASTY_GROUPS,
  dynasties,
  formatDynastyProbability,
  formatDynastyYear,
  getDynastyById,
  getDynastyClassProbability,
  translateDynastyGender
} from '@/lib/dynasty-rebirth';
import { useDynastyBirth } from '@/lib/store/useDynastyBirth';
import { CARD_HEIGHT, CARD_WIDTH } from '@/lib/dynasty-spin';
import { DynastyCardShell } from '@/components/dynasty-card-shell';
import { dynastyCardVars } from '@/lib/dynasty-card-style';
import './dynasty-flip-card.css';

interface AtlasRecord {
  generation: number;
  gender: 'male' | 'female';
}

/** 图鉴背面一屏能放下的记录数，多出的丢掉、不出现滚动条 */
const ATLAS_BACK_RECORD_LIMIT = 5;

function AtlasCard({
  dynastyId,
  classLevel,
  className,
  probability,
  records,
  lit
}: {
  dynastyId: string;
  classLevel: ClassLevel;
  className: string;
  probability: number;
  records: AtlasRecord[];
  lit: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const dynasty = getDynastyById(dynastyId);
  const tier = CLASS_STAMPS[classLevel];
  const cardVars = dynastyCardVars(classLevel) as React.CSSProperties;
  const cardKey = `${dynastyId}:${classLevel}`;
  const isViewed = useDynastyBirth(state =>
    Boolean(state.viewedAtlasKeys[cardKey])
  );
  const markAtlasCardViewed = useDynastyBirth(
    state => state.markAtlasCardViewed
  );

  const isNew = lit && !isViewed;

  const handleClick = () => {
    setFlipped(v => !v);
    if (isNew) {
      markAtlasCardViewed(cardKey);
    }
  };

  const newestFirst = [...records].sort(
    (a, b) => b.generation - a.generation
  );
  const truncated = newestFirst.length > ATLAS_BACK_RECORD_LIMIT;
  const visibleRecords = newestFirst.slice(0, ATLAS_BACK_RECORD_LIMIT);

  return (
    <button
      type="button"
      className="atlas-card-button"
      onClick={handleClick}
      aria-label={`${dynasty?.name ?? dynastyId} ${className} 图鉴`}
    >
      <div
        className={`dynasty-flipper atlas-flipper ${flipped ? 'is-flipped' : ''}`}
      >
        <div className="dynasty-flipper-inner">
          <div className="dynasty-face dynasty-face-front">
            <div
              className={`dynasty-card is-preview tier-${classLevel} ${lit ? 'is-lit' : 'is-dim'}`}
              style={cardVars}
            >
              <DynastyCardShell dynastyId={dynastyId} />
              {isNew && (
                <div className="corner-badge-ribbon" aria-label="首次解锁">
                  <span>NEW</span>
                </div>
              )}
              <div className="atlas-card-inner">
                <p className="atlas-hero-title">{className}</p>
                {lit && !isNew && records.length > 1 && (
                  <span className="atlas-count">×{records.length}</span>
                )}
              </div>
            </div>
          </div>
          <div className="dynasty-face dynasty-face-back">
            <div
              className={`dynasty-card is-result tier-${classLevel}`}
              style={cardVars}
            >
              <DynastyCardShell dynastyId={dynastyId} />
              <div className="atlas-back-inner">
                <p className="atlas-back-title">
                  {dynasty?.name} · {className}
                </p>
                <div className="atlas-back-badge">
                  <span>{tier.name} · {formatDynastyProbability(probability)}</span>
                </div>
                {visibleRecords.length === 0 ? (
                  <p className="atlas-back-empty">
                    尚未投胎到此身份
                  </p>
                ) : (
                  <ul className="atlas-record-list">
                    {visibleRecords.map(record => (
                      <li key={record.generation}>
                        <span>
                          第 {record.generation} 世 ·{' '}
                          {translateDynastyGender(record.gender)}
                        </span>
                      </li>
                    ))}
                    {truncated ? (
                      <li className="atlas-record-more" aria-hidden="true">
                        ……
                      </li>
                    ) : null}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function DynastyAtlas() {
  const birthResults = useDynastyBirth(state => state.birthResults);

  const recordsByKey = useMemo(() => {
    const map = new Map<string, AtlasRecord[]>();
    birthResults.forEach((r, index) => {
      const key = `${r.dynastyId}:${r.classLevel}`;
      const list = map.get(key) ?? [];
      list.push({
        generation: index + 1,
        gender: r.gender
      });
      map.set(key, list);
    });
    return map;
  }, [birthResults]);

  const dynastyMap = useMemo(
    () => new Map(dynasties.map(d => [d.id, d])),
    []
  );

  return (
    <View gap={4}>
      {DYNASTY_GROUPS.map(group => (
        <View key={group.label} gap={2}>
          <Text variant="body-2" weight="medium">
            {group.label}
          </Text>
          {group.ids.map(id => {
            const dynasty = dynastyMap.get(id);
            if (!dynasty) return null;
            return (
              <View key={id} gap={1}>
                <Text variant="body-3" color="neutral-faded">
                  {dynasty.name}（{formatDynastyYear(dynasty.startYear)}–
                  {formatDynastyYear(dynasty.endYear)}）
                </Text>
                <div
                  className="atlas-grid"
                  style={
                    {
                      '--csgo-card-width': `${CARD_WIDTH}px`,
                      '--csgo-card-height': `${CARD_HEIGHT}px`
                    } as React.CSSProperties
                  }
                >
                  {dynasty.classes.map(cls => {
                    const key = `${dynasty.id}:${cls.level}`;
                    const records = recordsByKey.get(key) ?? [];
                    return (
                      <AtlasCard
                        key={cls.id}
                        dynastyId={dynasty.id}
                        classLevel={cls.level as ClassLevel}
                        className={cls.name}
                        probability={getDynastyClassProbability(
                          dynasty.id,
                          cls.id
                        )}
                        records={records}
                        lit={records.length > 0}
                      />
                    );
                  })}
                </div>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export default DynastyAtlas;
