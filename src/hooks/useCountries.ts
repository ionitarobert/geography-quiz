import { useEffect, useState } from 'react';
import type { CountryFeature } from '../types';

let cached: CountryFeature[] | null = null;
let inflight: Promise<CountryFeature[]> | null = null;

function loadCountries(): Promise<CountryFeature[]> {
  if (cached) return Promise.resolve(cached);
  if (inflight) return inflight;
  inflight = fetch('/countries.geojson')
    .then((r) => r.json())
    .then((data) => {
      cached = data.features as CountryFeature[];
      return cached;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function useCountries(): CountryFeature[] {
  const [countries, setCountries] = useState<CountryFeature[]>(() => cached ?? []);

  useEffect(() => {
    if (cached) return;
    let cancelled = false;
    loadCountries().then((data) => {
      if (!cancelled) setCountries(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return countries;
}
