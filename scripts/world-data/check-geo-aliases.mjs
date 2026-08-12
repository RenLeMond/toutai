#!/usr/bin/env node
/**
 * Compare world_result.json country names against world.json GeoJSON + aliases.
 * Run: node scripts/world-data/check-geo-aliases.mjs
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

const worldResult = JSON.parse(
  readFileSync(join(root, 'app/_data/world_result.json'), 'utf8')
);
const worldGeo = JSON.parse(
  readFileSync(join(root, 'app/_data/world.json'), 'utf8')
);

const aliasesSource = readFileSync(
  join(root, 'app/_lib/world-geo-aliases.ts'),
  'utf8'
);

function parseAliases(source) {
  const block =
    source.match(
      /WORLD_GEO_ALIASES: Record<string, string> = \{([\s\S]*?)\n\};/
    )?.[1] ?? '';
  const aliases = {};
  const re =
    /(?:'([^']*)'|"([^"]*)"|(\w+))\s*:\s*(?:'([^']*)'|"([^"]*)")/g;
  let match;
  while ((match = re.exec(block)) !== null) {
    const key = match[1] ?? match[2] ?? match[3];
    const value = match[4] ?? match[5];
    if (key && value) aliases[key] = value;
  }
  return aliases;
}

function parseGeoMissing(source) {
  const block =
    source.match(/GEO_MISSING = \[([\s\S]*?)\] as const/)?.[1] ?? '';
  return [...block.matchAll(/'([^']+)'/g)].map(m => m[1]);
}

const aliases = parseAliases(aliasesSource);
const geoMissing = new Set(parseGeoMissing(aliasesSource));

const geoNames = new Set(
  worldGeo.features.map(f => f.properties?.name).filter(Boolean)
);

const enNames = [...new Set(worldResult.map(r => r.en).filter(Boolean))];

const unmatched = [];
const matchedViaAlias = [];
const missingPolygon = [];

for (const en of enNames.sort()) {
  const geoName = aliases[en] ?? en;
  if (geoNames.has(geoName)) {
    if (aliases[en]) matchedViaAlias.push({ en, geoName });
    continue;
  }
  if (geoMissing.has(en)) {
    missingPolygon.push(en);
    continue;
  }
  unmatched.push({ en, tried: geoName });
}

console.log('=== Geo alias check ===\n');
console.log(`Countries in data: ${enNames.length}`);
console.log(`GeoJSON regions: ${geoNames.size}`);
console.log(`Matched via alias: ${matchedViaAlias.length}`);
console.log(`Known missing polygon (pin-only): ${missingPolygon.length}`);
console.log(`Unmatched (needs fix): ${unmatched.length}\n`);

if (unmatched.length > 0) {
  console.log('Unmatched:');
  unmatched.forEach(({ en, tried }) =>
    console.log(`  - "${en}" → tried "${tried}"`)
  );
} else {
  console.log('All mappable countries resolve to GeoJSON names.');
}

if (missingPolygon.length > 0) {
  console.log('\nPin-only (no GeoJSON face):');
  missingPolygon.forEach(en => console.log(`  - ${en}`));
}

process.exit(unmatched.length > 0 ? 1 : 0);
