import worldData from '@/data/world_result.json';

export const CONTINENT_MAP: Record<string, string> = {
  AF: '非洲',
  EU: '欧洲',
  AS: '亚洲',
  NA: '北美洲',
  SA: '南美洲',
  OA: '大洋洲',
  AN: '南极洲'
};

export const CONTINENT_ORDER = [
  '非洲',
  '欧洲',
  '亚洲',
  '北美洲',
  '南美洲',
  '大洋洲',
  '南极洲'
] as const;

interface WorldCountryRecord {
  cn: string;
  en: string;
  continent: string;
  position: [number, number];
  birth_rate: number;
}

interface WorldMetadataRecord {
  total_birth?: number;
}

type WorldDataRecord = WorldCountryRecord | WorldMetadataRecord;

export interface WorldBirthResult {
  country: string;
  countryEn: string;
  continent: string;
  continentCode: string;
  probability: number;
  position: [number, number];
}

export interface WorldCountryOption {
  cn: string;
  en: string;
  continent: string;
  probability: number;
}

const countries = (worldData as WorldDataRecord[]).filter(
  (item): item is WorldCountryRecord =>
    'birth_rate' in item && typeof item.birth_rate === 'number'
);

const totalBirthRate = countries.reduce(
  (sum, country) => sum + country.birth_rate,
  0
);

export const worldCountryOptions: WorldCountryOption[] = countries
  .map(country => ({
    cn: country.cn,
    en: country.en,
    continent: CONTINENT_MAP[country.continent] ?? country.continent,
    probability: country.birth_rate
  }))
  .sort((a, b) => b.probability - a.probability);

export function simulateWorldBirth(): WorldBirthResult {
  const randomNumber = Math.random() * totalBirthRate;
  let cumulativeRate = 0;

  for (const country of countries) {
    cumulativeRate += country.birth_rate;
    if (cumulativeRate > randomNumber) {
      return toBirthResult(country);
    }
  }

  return toBirthResult(countries[countries.length - 1]);
}

function toBirthResult(country: WorldCountryRecord): WorldBirthResult {
  return {
    country: country.cn,
    countryEn: country.en,
    continent: CONTINENT_MAP[country.continent] ?? country.continent,
    continentCode: country.continent,
    probability: country.birth_rate,
    position: country.position
  };
}

export function getCountryProbability(countryEn: string) {
  const country = countries.find(item => item.en === countryEn);
  if (!country) return null;

  return {
    country: country.cn,
    countryEn: country.en,
    continent: CONTINENT_MAP[country.continent] ?? country.continent,
    probability: country.birth_rate
  };
}

export function formatWorldProbability(probability: number) {
  return `${probability.toFixed(4)}%`;
}
