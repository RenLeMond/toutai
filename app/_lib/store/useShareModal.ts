import { create } from 'zustand';
import type { ClassLevel } from '@/lib/dynasty-rebirth';

export interface ShareInfo {
  mode: 'china' | 'world' | 'dynasty';
  count: number;
  region: string;
  category: string;
  gender: string;
  order: string;
  probability: number;
  continent?: string;
  position?: [number, number];
  countryEn?: string;
  dynastyName?: string;
  className?: string;
  classLevel?: ClassLevel;
  dynastyId?: string;
  classDesc?: string;
  flavor?: string;
}

interface ShareModalState {
  active: boolean;
  shareInfo: ShareInfo;
  activate: () => void;
  deactivate: () => void;
  setShareInfo: (info: ShareInfo) => void;
  openShare: (info: ShareInfo) => void;
}

const defaultShareInfo: ShareInfo = {
  mode: 'china',
  count: 0,
  region: '',
  category: '',
  gender: '',
  order: '',
  probability: 0
};

const useShareModal = create<ShareModalState>(set => ({
  active: false,
  shareInfo: defaultShareInfo,
  activate: () => set({ active: true }),
  deactivate: () => set({ active: false }),
  setShareInfo: (info: ShareInfo) => set({ shareInfo: info }),
  openShare: (info: ShareInfo) => set({ shareInfo: info, active: true })
}));

export default useShareModal;
