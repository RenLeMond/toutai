'use client';

import React from 'react';
import QRCode from 'react-qr-code';
import { Text } from 'reshaped';
import { CLASS_STAMPS, type ClassLevel } from '@/lib/dynasty-rebirth';
import { DynastyResultCard } from '@/components/dynasty-result-card';
import { CarrotIcon } from '@/components/title';
import type { ShareInfo } from '@/lib/store/useShareModal';
import { siteUrl } from '@/lib/site';
import './dynasty-share-poster.css';

const DYNASTY_SHARE_URL = `${siteUrl}/dynasty`;

function glowLevel(level: ClassLevel | undefined): ClassLevel | null {
  if (level === 1 || level === 2 || level === 3) return level;
  return null;
}

export default function DynastySharePoster({
  shareInfo
}: {
  shareInfo: ShareInfo;
}) {
  const level = shareInfo.classLevel ?? 3;
  const rareGlow = glowLevel(shareInfo.classLevel);
  const gender = shareInfo.gender === 'female' ? 'female' : 'male';

  return (
    <div className="dynasty-share-poster" id="shareContent">
      <p className="dynasty-share-eyebrow">
        第 <span className="dynasty-share-count">{shareInfo.count}</span> 次投胎
      </p>
      <div className="dynasty-share-stage">
        <div className="dynasty-share-card-wrap">
          {rareGlow ? (
            <div
              className="dynasty-share-glow"
              style={{ background: CLASS_STAMPS[rareGlow].glow }}
            />
          ) : null}
          <DynastyResultCard
            dynastyId={shareInfo.dynastyId}
            dynastyName={shareInfo.dynastyName ?? shareInfo.region}
            className={shareInfo.className ?? shareInfo.category}
            classLevel={level}
            classDesc={shareInfo.classDesc ?? ''}
            gender={gender}
            probability={shareInfo.probability}
          />
        </div>
      </div>
      <p className="dynasty-share-flavor">{shareInfo.flavor ?? ''}</p>
      <div className="dynasty-share-footer">
        <div className="dynasty-share-brand">
          <CarrotIcon size={40} />
          <div className="dynasty-share-brand-text">
            <Text color="primary" weight="medium" variant="body-1">
              投胎模拟器
            </Text>
            <Text color="primary" weight="medium">
              toutai.online/dynasty
            </Text>
          </div>
        </div>
        <QRCode
          value={DYNASTY_SHARE_URL}
          bgColor="#f5f3ef"
          fgColor="#000000"
          level="L"
          size={256}
          className="dynasty-share-qr"
        />
      </div>
    </div>
  );
}
