import dynastiesData from '@/data/dynasties.json';

export type ClassLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface DynastyClass {
  id: string;
  name: string;
  level: ClassLevel;
  prob: number;
  desc: string;
}

export interface Dynasty {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  duration: number;
  popWan: number;
  weight: number;
  dynastyProb: number;
  capital?: string;
  founder?: string;
  feature?: string;
  classes: DynastyClass[];
}

export interface DynastyBirthResult {
  dynastyId: string;
  dynastyName: string;
  classId: string;
  className: string;
  classLevel: ClassLevel;
  classDesc: string;
  gender: 'male' | 'female';
  probability: number;
}

export const CLASS_STAMPS: Record<
  ClassLevel,
  { name: string; border: string; text: string; glow: string }
> = {
  // CSGO: ★ 金色（刀/手套）
  1: {
    name: '皇室',
    border: '#e4ae39',
    text: '#f0c55a',
    glow: 'rgba(228, 174, 57, 0.45)'
  },
  // CSGO: 隐秘 Covert 红
  2: {
    name: '贵族',
    border: '#eb4b4b',
    text: '#ef5350',
    glow: 'rgba(235, 75, 75, 0.4)'
  },
  // CSGO: 保密 Classified 粉
  3: {
    name: '官僚',
    border: '#f249b8',
    text: '#ff6ec7',
    glow: 'rgba(242, 73, 184, 0.38)'
  },
  // CSGO: 受限 Restricted 真紫（不用靛蓝，避免和军规蓝糊在一起）
  4: {
    name: '士绅',
    border: '#8847ff',
    text: '#c4b5fd',
    glow: 'rgba(136, 71, 255, 0.38)'
  },
  // CSGO: 军规 Mil-Spec 蓝
  5: {
    name: '平民',
    border: '#4b69ff',
    text: '#93c5fd',
    glow: 'rgba(75, 105, 255, 0.28)'
  },
  // 暖石灰（不用消费级钢蓝，避免和军规蓝仍偏同色）
  6: {
    name: '底层',
    border: '#b5a89c',
    text: '#e8e0d8',
    glow: 'rgba(181, 168, 156, 0.24)'
  }
};

export const DYNASTY_GROUPS: { label: string; ids: string[] }[] = [
  {
    label: '秦汉',
    ids: ['QIN', 'WESTERN_HAN', 'XIN', 'EASTERN_HAN']
  },
  {
    label: '三国 · 晋 · 南北朝',
    ids: ['THREE_KINGDOMS', 'JIN', 'SOUTHERN_NORTHERN']
  },
  {
    label: '隋唐',
    ids: ['SUI', 'TANG']
  },
  {
    label: '宋元',
    ids: ['SONG', 'YUAN']
  },
  {
    label: '明清',
    ids: ['MING', 'QING']
  }
];

export const dynasties = dynastiesData as Dynasty[];

export const TOTAL_DYNASTY_WEIGHT = dynasties.reduce((sum, d) => sum + d.weight, 0);
const GENDER_FACTOR = 0.5;

const FLAVOR_HIGH = ['天命所归，贵不可言！', '欧气爆棚，万中无一！', '这一抽，值了！'];
const FLAVOR_MID = ['官宦之家，衣食无忧。', '士绅门第，小有前程。'];
const FLAVOR_LOW = ['布衣一生，倒也踏实。', '寻常百姓，平平淡淡。'];
const FLAVOR_BOTTOM = ['开局即地狱难度……', '这运气，建议再抽一次。', '底层开局，命途多舛。'];

export function formatDynastyYear(year: number): string {
  return year < 0 ? `公元前${Math.abs(year)}年` : `公元${year}年`;
}

export function formatDynastyProbability(probability: number): string {
  return `${(probability * 100).toPrecision(2)}%`;
}

export function translateDynastyGender(gender: 'male' | 'female'): string {
  return gender === 'male' ? '男' : '女';
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function pickWeightedDynasty(): Dynasty {
  let rnd = Math.random() * TOTAL_DYNASTY_WEIGHT;
  for (const dynasty of dynasties) {
    if (rnd < dynasty.weight) return dynasty;
    rnd -= dynasty.weight;
  }
  return dynasties[dynasties.length - 1];
}

function pickWeightedClass(dynasty: Dynasty): DynastyClass {
  const totalWeight = dynasty.classes.reduce((sum, c) => sum + c.prob, 0);
  let rnd = Math.random() * totalWeight;
  for (const cls of dynasty.classes) {
    if (rnd < cls.prob) return cls;
    rnd -= cls.prob;
  }
  return dynasty.classes[dynasty.classes.length - 1];
}

export function getDynastyClassProbability(
  dynastyId: string,
  classId: string
): number {
  const dynasty = dynasties.find(d => d.id === dynastyId);
  if (!dynasty) return 0;
  const cls = dynasty.classes.find(c => c.id === classId);
  if (!cls) return 0;
  return dynasty.dynastyProb * cls.prob * GENDER_FACTOR;
}

export function getDynastyProbabilityFormula(): string {
  return String.raw`\displaystyle{P = p_{\text{朝代}} \times p_{\text{阶级}} \times \frac{1}{2}}`;
}

export function getDynastyProbabilityExplanation(): string {
  return String.raw`p_{\text{朝代}} = \frac{\text{国祚} \times \text{代表人口}}{\sum(\text{国祚} \times \text{代表人口})}`;
}

export function getFlavorLine(level: ClassLevel): string {
  if (level <= 2) return pickRandom(FLAVOR_HIGH);
  if (level <= 4) return pickRandom(FLAVOR_MID);
  if (level === 5) return pickRandom(FLAVOR_LOW);
  return pickRandom(FLAVOR_BOTTOM);
}

export function simulateDynastyBirth(): DynastyBirthResult {
  const dynasty = pickWeightedDynasty();
  const chosenClass = pickWeightedClass(dynasty);
  const gender: 'male' | 'female' = Math.random() < 0.5 ? 'male' : 'female';
  const probability = getDynastyClassProbability(dynasty.id, chosenClass.id);

  return {
    dynastyId: dynasty.id,
    dynastyName: dynasty.name,
    classId: chosenClass.id,
    className: chosenClass.name,
    classLevel: chosenClass.level,
    classDesc: chosenClass.desc,
    gender,
    probability
  };
}

export const dynastyOptions = dynasties.map(d => ({
  label: d.name,
  value: d.id
}));

export function getClassOptions(dynastyId: string) {
  const dynasty = dynasties.find(d => d.id === dynastyId);
  if (!dynasty) return [];
  return dynasty.classes.map(c => ({
    label: `${CLASS_STAMPS[c.level].name} · ${c.name}`,
    value: c.id
  }));
}

export function getDynastyById(id: string) {
  return dynasties.find(d => d.id === id);
}
