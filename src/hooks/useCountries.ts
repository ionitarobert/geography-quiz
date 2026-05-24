import { useEffect, useState } from 'react';
import type { CountryFeature } from '../types';

const GEOJSON_URL = '/countries.geojson';
const TIMEOUT_MS = 10_000;

let cached: CountryFeature[] | null = null;
let inflight: Promise<CountryFeature[]> | null = null;

function loadCountries(): Promise<CountryFeature[]> {
  if (cached) return Promise.resolve(cached);
  if (inflight) return inflight;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  inflight = fetch(GEOJSON_URL, { signal: controller.signal })
    .then((r) => {
      if (!r.ok) {
        throw new Error(`Failed to load countries (HTTP ${r.status})`);
      }
      return r.json();
    })
    .then((data) => {
      if (!data || !Array.isArray(data.features)) {
        throw new Error('Countries data is malformed');
      }
      cached = data.features as CountryFeature[];
      return cached;
    })
    .finally(() => {
      clearTimeout(timeoutId);
      inflight = null;
    });

  return inflight;
}

export interface CountriesState {
  countries: CountryFeature[];
  loading: boolean;
  error: Error | null;
  retry: () => void;
}

export function useCountries(): CountriesState {
  const [countries, setCountries] = useState<CountryFeature[]>(() => cached ?? []);
  const [loading, setLoading] = useState<boolean>(() => cached === null);
  const [error, setError] = useState<Error | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (cached) {
      setCountries(cached);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    loadCountries()
      .then((data) => {
        if (cancelled) return;
        setCountries(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  return {
    countries,
    loading,
    error,
    retry: () => setRetryKey((k) => k + 1),
  };
}
