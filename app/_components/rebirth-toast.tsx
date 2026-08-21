'use client';

import React, { ReactNode } from 'react';
import { Icon } from 'reshaped';
import { X } from 'lucide-react';
import { toast } from 'sonner';

type RebirthToastProps = {
  tone?: 'default' | 'critical' | 'positive';
  centered?: boolean;
  children: ReactNode;
  toastId: string | number;
};

export function RebirthToast({
  tone = 'default',
  centered,
  children,
  toastId
}: RebirthToastProps) {
  const toneClass =
    tone === 'critical'
      ? 'rebirth-toast--critical'
      : tone === 'positive'
        ? 'rebirth-toast--positive rebirth-toast--centered'
        : '';
  const centeredClass = centered ? 'rebirth-toast--centered' : '';
  return (
    <div className={`rebirth-toast ${toneClass} ${centeredClass}`.trim()}>
      <div className="rebirth-toast__body">{children}</div>
      <button
        type="button"
        className="rebirth-toast__close"
        aria-label="关闭通知"
        onClick={() => toast.dismiss(toastId)}
      >
        <Icon size={4} color="neutral-faded" svg={<X />} />
      </button>
    </div>
  );
}
