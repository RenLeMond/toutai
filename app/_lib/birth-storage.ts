import { MAX_BIRTH_RECORDS } from '@/lib/constants';

export function capRecords<T>(records: T[], max = MAX_BIRTH_RECORDS) {
  if (records.length <= max) {
    return { records, trimmed: false as const };
  }

  return {
    records: records.slice(-max),
    trimmed: true as const
  };
}
