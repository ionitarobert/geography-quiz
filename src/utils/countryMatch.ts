import type { CountryInfo } from '../types';

const NAME_OVERRIDES: Record<string, string> = {
  'United States of America': 'United States',
  'Republic of Serbia': 'Serbia',
  'Republic of Tanzania': 'Tanzania',
  'Republic of Congo': 'Republic of the Congo',
  'Democratic Republic of the Congo': 'Democratic Republic of the Congo',
  'Czech Republic': 'Czechia',
  'Macedonia': 'North Macedonia',
  'Ivory Coast': "Côte d'Ivoire",
  'East Timor': 'Timor-Leste',
  'Swaziland': 'Eswatini',
  'The Bahamas': 'Bahamas',
  'Guinea Bissau': 'Guinea-Bissau',
  'Brunei': 'Brunei Darussalam',
  'South Korea': 'Korea (Republic of)',
  'North Korea': "Korea (Democratic People's Republic of)",
  'Russia': 'Russian Federation',
  'Vietnam': 'Viet Nam',
  'Syria': 'Syrian Arab Republic',
  'Laos': "Lao People's Democratic Republic",
  'Iran': 'Iran (Islamic Republic of)',
  'Moldova': 'Moldova (Republic of)',
  'Bolivia': 'Bolivia (Plurinational State of)',
  'Venezuela': 'Venezuela (Bolivarian Republic of)',
};

export function apiQueryForName(geoName: string): string {
  return NAME_OVERRIDES[geoName] ?? geoName;
}

export function pickBestMatch(
  results: CountryInfo[],
  geoName: string,
): CountryInfo | null {
  if (results.length === 0) return null;
  const target = (NAME_OVERRIDES[geoName] ?? geoName).toLowerCase();
  const exact = results.find((c) => c.name.toLowerCase() === target);
  if (exact) return exact;
  const startsWith = results.find((c) => c.name.toLowerCase().startsWith(target));
  if (startsWith) return startsWith;
  return results[0];
}
