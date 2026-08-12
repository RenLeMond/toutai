#!/usr/bin/env node
/**
 * Fetch World Bank population + crude birth rate, refresh raw JSON and result.
 *
 * Usage:
 *   node scripts/world-data/fetch-world-bank.mjs [--year 2024] [--dry-run]
 *
 * Indicators:
 *   SP.POP.TOTL  — population (stored in thousands, matching existing raw files)
 *   SP.DYN.CBRT.IN — crude birth rate per 1,000 people
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dataDir = join(root, 'scripts/world-data');

const args = process.argv.slice(2);
const yearArg = args.find((_, i, arr) => arr[i - 1] === '--year');
const year = Number(yearArg ?? '2024');
const dryRun = args.includes('--dry-run');

if (!Number.isInteger(year) || year < 1960 || year > 2100) {
  console.error('Invalid --year value');
  process.exit(1);
}

const wbNameMap = JSON.parse(
  readFileSync(join(dataDir, 'wb-name-map.json'), 'utf8')
);

function toEnName(wbName) {
  return wbNameMap[wbName] ?? wbName;
}

async function fetchIndicator(indicator) {
  const rows = [];
  let page = 1;
  let pages = 1;

  while (page <= pages) {
    const url =
      `https://api.worldbank.org/v2/country/all/indicator/${indicator}` +
      `?format=json&date=${year}&per_page=20000&page=${page}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`World Bank API ${response.status} for ${indicator}`);
    }

    const payload = await response.json();
    pages = payload[0]?.pages ?? 1;
    rows.push(...(payload[1] ?? []));
    page += 1;
  }

  return rows.filter(row => row.value != null && row.countryiso3code);
}

async function main() {
  console.log(`Fetching World Bank data for ${year}...`);

  const [popRows, birthRows] = await Promise.all([
    fetchIndicator('SP.POP.TOTL'),
    fetchIndicator('SP.DYN.CBRT.IN')
  ]);

  console.log(
    `API rows: population ${popRows.length}, birth rate ${birthRows.length}`
  );
  console.log(`Population dataset last updated: ${popRows[0]?.lastupdated ?? 'unknown'}`);

  const popByEn = {};
  for (const row of popRows) {
    popByEn[toEnName(row.country.value)] = row.value / 1000;
  }

  const birthByEn = {};
  for (const row of birthRows) {
    birthByEn[toEnName(row.country.value)] = row.value;
  }

  const wbPopNames = new Set(popRows.map(row => row.country.value));

  const countries = JSON.parse(
    readFileSync(join(dataDir, 'raw_data.json'), 'utf8')
  );

  let previousPopulation = {};
  let previousBirthRate = {};
  try {
    previousPopulation = JSON.parse(
      readFileSync(join(dataDir, 'raw_population.json'), 'utf8')
    );
    previousBirthRate = JSON.parse(
      readFileSync(join(dataDir, 'raw_birth_data.json'), 'utf8')
    );
  } catch {
    // First run without existing raw files.
  }

  const population = {};
  const birthRate = {};
  const missing = [];
  const fallback = [];

  for (const country of countries) {
    const en = country.en;
    let pop = popByEn[en];
    let birth = birthByEn[en];

    if (pop == null || birth == null) {
      for (const wbName of wbPopNames) {
        if (toEnName(wbName) !== en) continue;
        pop ??= popByEn[toEnName(wbName)];
        birth ??= birthByEn[toEnName(wbName)];
      }
    }

    if (pop == null || birth == null) {
      if (previousPopulation[en] != null && previousBirthRate[en] != null) {
        population[en] = previousPopulation[en];
        birthRate[en] = previousBirthRate[en];
        fallback.push(en);
        continue;
      }
      missing.push(en);
      continue;
    }

    population[en] = Math.round(pop * 100) / 100;
    birthRate[en] = birth;
  }

  console.log(`Matched countries: ${Object.keys(population).length}/${countries.length}`);

  if (fallback.length > 0) {
    console.warn('\nKept previous values (no World Bank row for target year):');
    fallback.forEach(name => console.warn(`  - ${name}`));
  }

  if (missing.length > 0) {
    console.warn('\nMissing data for:');
    missing.forEach(name => console.warn(`  - ${name}`));
  }

  if (dryRun) {
    const oldPop = JSON.parse(
      readFileSync(join(dataDir, 'raw_population.json'), 'utf8')
    );
    const cnOld = oldPop.China;
    const cnNew = population.China;
    const inOld = oldPop.India;
    const inNew = population.India;
    console.log('\nDry run sample:');
    console.log(`  China population: ${cnOld} -> ${cnNew}`);
    console.log(`  India population: ${inOld} -> ${inNew}`);
    console.log('No files written.');
    process.exit(missing.length > 0 ? 1 : 0);
  }

  writeFileSync(
    join(dataDir, 'raw_population.json'),
    `${JSON.stringify(population, null, 4)}\n`
  );
  writeFileSync(
    join(dataDir, 'raw_birth_data.json'),
    `${JSON.stringify(birthRate, null, 4)}\n`
  );

  const meta = {
    source: 'World Bank',
    dataYear: year,
    note: `数据来自世界银行 ${year} 年人口与粗出生率统计。`,
    fallbackRegions: fallback
  };

  writeFileSync(
    join(dataDir, 'meta.json'),
    `${JSON.stringify(meta, null, 2)}\n`
  );
  writeFileSync(
    join(root, 'app/_data/world_meta.json'),
    `${JSON.stringify(meta, null, 2)}\n`
  );

  console.log('\nRunning data_parser.py...');
  const parser = spawnSync('python', ['data_parser.py'], {
    cwd: dataDir,
    encoding: 'utf8'
  });

  if (parser.status !== 0) {
    console.error(parser.stdout);
    console.error(parser.stderr);
    process.exit(parser.status ?? 1);
  }

  writeFileSync(
    join(root, 'app/_data/world_result.json'),
    readFileSync(join(dataDir, 'result.json'), 'utf8')
  );

  console.log('Updated:');
  console.log('  scripts/world-data/raw_population.json');
  console.log('  scripts/world-data/raw_birth_data.json');
  console.log('  scripts/world-data/meta.json');
  console.log('  app/_data/world_meta.json');
  console.log('  app/_data/world_result.json');

  process.exit(missing.length > 0 ? 1 : 0);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
