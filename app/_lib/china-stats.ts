import { BirthResult, getProvinceTheoreticalRate, TOTAL_CHINA_PROVINCES } from '@/lib/rebirth';

export interface ProvinceStats {
  province: string;
  count: number;
  empiricalRate: number;
  theoreticalRate: number;
}

export interface ChinaPersonalStats {
  total: number;
  uniqueProvinces: number;
  totalProvinces: number;
  topProvince: string | null;
  topProvinceCount: number;
  topProvinceRate: number;
  gender: { male: number; female: number };
  category: { city: number; town: number; countryside: number };
}

export function getProvinceStats(
  birthResults: BirthResult[],
  province: string
): ProvinceStats {
  const count = birthResults.filter(result => result.province === province).length;
  const total = birthResults.length;

  return {
    province,
    count,
    empiricalRate: total > 0 ? count / total : 0,
    theoreticalRate: getProvinceTheoreticalRate(province)
  };
}

export function computeChinaPersonalStats(
  birthResults: BirthResult[]
): ChinaPersonalStats {
  const total = birthResults.length;
  const provinceCounts = new Map<string, number>();
  const gender = { male: 0, female: 0 };
  const category = { city: 0, town: 0, countryside: 0 };

  birthResults.forEach(result => {
    provinceCounts.set(
      result.province,
      (provinceCounts.get(result.province) ?? 0) + 1
    );

    if (result.gender === 'male') {
      gender.male += 1;
    } else if (result.gender === 'female') {
      gender.female += 1;
    }

    if (result.category === '城市') {
      category.city += 1;
    } else if (result.category === '城镇') {
      category.town += 1;
    } else if (result.category === '乡村') {
      category.countryside += 1;
    }
  });

  let topProvince: string | null = null;
  let topProvinceCount = 0;

  provinceCounts.forEach((count, province) => {
    if (count > topProvinceCount) {
      topProvince = province;
      topProvinceCount = count;
    }
  });

  return {
    total,
    uniqueProvinces: provinceCounts.size,
    totalProvinces: TOTAL_CHINA_PROVINCES,
    topProvince,
    topProvinceCount,
    topProvinceRate: total > 0 ? topProvinceCount / total : 0,
    gender,
    category
  };
}
