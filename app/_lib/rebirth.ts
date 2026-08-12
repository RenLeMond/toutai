import data from '@/data/birthrate.json';
import dataDetailed from '@/data/birthrate_detailed.json';
import { TOTAL_CHINA_PROVINCES } from '@/lib/constants';

const chinaBirthPopulation = 12123210;
const hongKongBirthPopulation = 33200;
const macauBirthPopulation = 3712;
const taiwanBirthPopulation = 137413;

export const totalPopulation =
  chinaBirthPopulation +
  hongKongBirthPopulation +
  macauBirthPopulation +
  taiwanBirthPopulation;

interface Region {
  id: string;
  name: string;
  total: number;
  male: number;
  female: number;
}

export const regions: Region[] = data.region.slice(1);

interface CategoryData {
  [order: string]: {
    male: number;
    female: number;
  };
}

export interface BirthData {
  id: number;
  name: string;
  display_name: string;
  town: CategoryData;
  city: CategoryData;
  countryside: CategoryData;
}

export interface BirthResult {
  province: string;
  id: number;
  category: string;
  gender: string;
  order: string;
  probability: number;
}

export const birthDataDetailed: BirthData[] = dataDetailed.slice(1);

export const provinceOptions = birthDataDetailed
  .filter(region => region.name !== 'national')
  .sort((a, b) => a.id - b.id)
  .map(region => ({
    label: region.display_name,
    value: region.name
  }));

export { TOTAL_CHINA_PROVINCES };

type DistributionEntry = BirthResult & { cumulative: number };

const EMPTY_BIRTH_RESULT: BirthResult = {
  id: 0,
  province: '',
  gender: '',
  category: '',
  order: '',
  probability: 0
};

function isSpecialProvince(province: string): boolean {
  return ['xiang_gang', 'ao_men', 'tai_wan'].includes(province);
}

function buildDistribution(): DistributionEntry[] {
  const entries: DistributionEntry[] = [];
  let cumulativePopulation = 0;

  for (const region of dataDetailed) {
    if (region.name === 'national') continue;

    for (const category of ['town', 'city', 'countryside'] as const) {
      for (const order of [
        'one',
        'two',
        'three',
        'four',
        'five_plus'
      ] as const) {
        for (const gender of ['male', 'female'] as const) {
          let population = region[category][order][gender];
          if (!isSpecialProvince(region.name)) {
            population *= 10;
          }

          cumulativePopulation += population;
          entries.push({
            id: region.id,
            province: region.display_name,
            gender,
            category:
              category === 'town'
                ? '城镇'
                : category === 'city'
                  ? '城市'
                  : '乡村',
            order:
              order === 'one'
                ? '一'
                : order === 'two'
                  ? '二'
                  : order === 'three'
                    ? '三'
                    : order === 'four'
                      ? '四'
                      : '五及以上',
            probability: population / totalPopulation,
            cumulative: cumulativePopulation
          });
        }
      }
    }
  }

  return entries;
}

const distribution = buildDistribution();

function pickFromDistribution(randomNumber: number): BirthResult {
  let low = 0;
  let high = distribution.length - 1;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (distribution[mid].cumulative > randomNumber) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }

  const entry = distribution[low];
  if (!entry) {
    return EMPTY_BIRTH_RESULT;
  }

  const { cumulative: _cumulative, ...result } = entry;
  return result;
}

export function simulateBirth(): BirthResult {
  const randomNumber = Math.random() * totalPopulation;
  return pickFromDistribution(randomNumber);
}

/** English slug, e.g. `guang_dong` — matches `birthDataDetailed[].name` / calculator options. */
export type ProvinceSlug = string;
/** Chinese display name, e.g. `广东` — matches `BirthResult.province` / map labels. */
export type ProvinceLabel = string;

export function calculateBirthProbability(
  provinceSlug: ProvinceSlug,
  category: 'city' | 'town' | 'countryside',
  gender: 'male' | 'female',
  order: string
): { population: number; probability: number } {
  const region = birthDataDetailed.find(item => item.name === provinceSlug);
  if (!region) {
    return { population: 0, probability: 0 };
  }

  let categoryData;
  switch (category) {
    case 'town':
      categoryData = region.town;
      break;
    case 'city':
      categoryData = region.city;
      break;
    case 'countryside':
      categoryData = region.countryside;
      break;
    default:
      return { population: 0, probability: 0 };
  }

  const genderData = categoryData[order]?.[gender];
  if (genderData === undefined) {
    return { population: 0, probability: 0 };
  }

  let population = genderData;
  if (!isSpecialProvince(provinceSlug)) {
    population *= 10;
  }
  const probability = population / totalPopulation;

  return { population, probability };
}

export function getProvinceTheoreticalRate(
  province: ProvinceLabel | ProvinceSlug
): number {
  const byLabel = regions.find(item => item.name === province);
  if (byLabel) {
    return byLabel.total / totalPopulation;
  }

  const detailed = birthDataDetailed.find(
    item => item.name === province || item.display_name === province
  );
  if (!detailed) {
    return 0;
  }

  const matched = regions.find(item => item.name === detailed.display_name);
  return matched ? matched.total / totalPopulation : 0;
}

export function translateGender(gender: string): string {
  switch (gender) {
    case 'male':
      return '男';
    case 'female':
      return '女';
    default:
      return gender;
  }
}

export function translateGenderChild(gender: string): string {
  switch (gender) {
    case 'male':
      return '男孩';
    case 'female':
      return '女孩';
    default:
      return gender;
  }
}
