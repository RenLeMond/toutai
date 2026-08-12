/** Maps World Bank `en` names in world_result.json to ECharts world GeoJSON names */

/**
 * GeoJSON has no polygon for these — heat map stays pin-only, no alias needed.
 * Aruba, Channel Islands, Hong Kong, Macau, Maldives, Monaco, San Marino,
 * Kosovo, Taiwan, St. Martin, St. Kitts and Nevis (no matching face in world.json).
 */
export const GEO_MISSING = [
  'Aruba',
  'Channel Islands',
  'Hong Kong SAR China',
  'Macao SAR China',
  'Maldives',
  'Monaco',
  'San Marino',
  'Kosovo',
  'Taiwan',
  'St. Martin (French part)',
  'St. Kitts and Nevis'
] as const;

export const WORLD_GEO_ALIASES: Record<string, string> = {
  'Antigua and Barbuda': 'Antigua and Barb.',
  'Bahamas The': 'Bahamas',
  'Bosnia and Herzegovina': 'Bosnia and Herz.',
  'Brunei Darussalam': 'Brunei',
  'Cabo Verde': 'Cape Verde',
  'Cayman Islands': 'Cayman Is.',
  'Central African Republic': 'Central African Rep.',
  'Congo Dem. Rep.': 'Dem. Rep. Congo',
  'Congo Rep.': 'Congo',
  "Cote d'Ivoire": "Côte d'Ivoire",
  Czechia: 'Czech Rep.',
  'Dominican Republic': 'Dominican Rep.',
  'Egypt Arab Rep.': 'Egypt',
  'Equatorial Guinea': 'Eq. Guinea',
  Eswatini: 'Swaziland',
  'Faroe Islands': 'Faeroe Is.',
  'French Polynesia': 'Fr. Polynesia',
  'Gambia The': 'Gambia',
  'Hong Kong SAR China': 'Hong Kong',
  'Iran Islamic Rep.': 'Iran',
  "Korea Dem. People's Rep.": 'Dem. Rep. Korea',
  'Korea Rep.': 'Korea',
  'Kyrgyz Republic': 'Kyrgyzstan',
  'Macao SAR China': 'Macau',
  'Micronesia Fed. Sts.': 'Micronesia',
  'North Macedonia': 'Macedonia',
  'Northern Mariana Islands': 'N. Mariana Is.',
  'Russian Federation': 'Russia',
  'Sao Tome and Principe': 'São Tomé and Principe',
  'Slovak Republic': 'Slovakia',
  'Solomon Islands': 'Solomon Is.',
  'South Sudan': 'S. Sudan',
  'St. Kitts and Nevis': 'St. Kitts and Nevis',
  'St. Lucia': 'Saint Lucia',
  'St. Vincent and the Grenadines': 'St. Vin. and Gren.',
  'Syrian Arab Republic': 'Syria',
  Turkiye: 'Turkey',
  'Venezuela RB': 'Venezuela',
  'Virgin Islands (U.S.)': 'U.S. Virgin Is.',
  'Yemen Rep.': 'Yemen'
};

export function toGeoName(countryEn: string): string {
  return WORLD_GEO_ALIASES[countryEn] ?? countryEn;
}
