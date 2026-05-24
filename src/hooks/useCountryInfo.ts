import { useCallback, useEffect, useState } from 'react';
import type { CountryInfo } from '../types';
import { apiQueryForName, pickBestMatch } from '../utils';

const API_BASE = '/api/countries/name';
const TIMEOUT_MS = 5_000;

const cache = new Map<string, CountryInfo | null>();
const inflight = new Map<string, Promise<CountryInfo | null>>();

async function fetchCountry(geoName: string): Promise<CountryInfo | null> {
  if (cache.has(geoName)) return cache.get(geoName) ?? null;
  const existing = inflight.get(geoName);
  if (existing) return existing;

  const query = apiQueryForName(geoName);
  const url = `${API_BASE}/${encodeURIComponent(query)}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const promise = fetch(url, { signal: controller.signal })
    .then(async (res) => {
      if (res.status === 404) return null;
      if (!res.ok) {
        throw new Error(`Country API responded ${res.status}`);
      }
      const text = await res.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) return null;
      return pickBestMatch(data as CountryInfo[], geoName);
    })
    .then((value) => {
      cache.set(geoName, value);
      return value;
    })
    .finally(() => {
      clearTimeout(timeoutId);
      inflight.delete(geoName);
    });

  inflight.set(geoName, promise);
  return promise;
}

export interface CountryInfoState {
  data: CountryInfo | null;
  loading: boolean;
  notFound: boolean;
  error: Error | null;
  retry: () => void;
}

export function useCountryInfo(geoName: string | null): CountryInfoState {
  const [retryKey, setRetryKey] = useState(0);
  const [state, setState] = useState<Omit<CountryInfoState, 'retry'>>(() => ({
    data: geoName ? cache.get(geoName) ?? null : null,
    loading: geoName ? !cache.has(geoName) : false,
    notFound: false,
    error: null,
  }));

  const retry = useCallback(() => setRetryKey((k) => k + 1), []);

  useEffect(() => {
    if (!geoName) {
      setState({ data: null, loading: false, notFound: false, error: null });
      return;
    }
    if (cache.has(geoName)) {
      const cached = cache.get(geoName) ?? null;
      setState({
        data: cached,
        loading: false,
        notFound: cached === null,
        error: null,
      });
      return;
    }

    let cancelled = false;
    setState({ data: null, loading: true, notFound: false, error: null });

    fetchCountry(geoName)
      .then((data) => {
        if (cancelled) return;
        setState({
          data,
          loading: false,
          notFound: data === null,
          error: null,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const e = err instanceof Error ? err : new Error(String(err));
        setState({ data: null, loading: false, notFound: false, error: e });
      });

    return () => {
      cancelled = true;
    };
  }, [geoName, retryKey]);

  return { ...state, retry };
}
