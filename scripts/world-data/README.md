# World data pipeline

Regenerate `app/_data/world_result.json` from World Bank raw sources.

## Refresh from World Bank API

```bash
# Preview changes without writing files
node scripts/world-data/fetch-world-bank.mjs --year 2024 --dry-run

# Fetch SP.POP.TOTL + SP.DYN.CBRT.IN, rebuild result JSON
node scripts/world-data/fetch-world-bank.mjs --year 2024
```

This updates:

- `scripts/world-data/raw_population.json`
- `scripts/world-data/raw_birth_data.json`
- `scripts/world-data/meta.json`
- `app/_data/world_meta.json`
- `app/_data/world_result.json`

Use `--year 2023` if some small economies lack 2024 values yet.

## Manual pipeline (legacy)

```bash
cd scripts/world-data
python data_parser.py
cp result.json ../../app/_data/world_result.json
```

Update `app/_data/world_meta.json` `dataYear` when refreshing data manually.

## Validation

```bash
node scripts/world-data/check-geo-aliases.mjs
```

## Source

Indicators from [World Bank Open Data](https://data.worldbank.org/):

- `SP.POP.TOTL` — population, total
- `SP.DYN.CBRT.IN` — birth rate, crude (per 1,000 people)

Country metadata (`raw_data.json`, coordinates, continents) originates from the [Reborn](https://github.com/Uahh/Reborn) project. World Bank API country names are mapped via `wb-name-map.json`.
