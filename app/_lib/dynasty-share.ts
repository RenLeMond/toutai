import { CLASS_STAMPS, type DynastyBirthResult } from '@/lib/dynasty-rebirth';
import type { ShareInfo } from '@/lib/store/useShareModal';

export function buildDynastyShareInfo(
  result: DynastyBirthResult,
  count: number,
  flavor: string
): ShareInfo {
  return {
    mode: 'dynasty',
    count,
    region: result.dynastyName,
    category: result.className,
    gender: result.gender,
    order: CLASS_STAMPS[result.classLevel].name,
    probability: result.probability,
    dynastyName: result.dynastyName,
    className: result.className,
    classLevel: result.classLevel,
    dynastyId: result.dynastyId,
    classDesc: result.classDesc,
    flavor
  };
}
