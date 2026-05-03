import { useEffect, useState } from 'react';
import type { CountryInfo } from '../types';
import { apiQueryForName, pickBestMatch } from '../utils';

const API_BASE = '/api/countries/name';

const cache = new Map<string, CountryInfo | null>();
const inflight = new Map<string, Promise<CountryInfo | null>>();

async function fetchCountry(geoName: string): Promise<CountryInfo | null> {
  if (cache.has(geoName)) return cache.get(geoName) ?? null;
  const existing = inflight.get(geoName);
  if (existing) return existing;

  const query = apiQueryForName(geoName);
  const url = `${API_BASE}/${encodeURIComponent(query)}`;
  const promise = fetch(url)
    .then(async (res) => {
      if (!res.ok) return null;
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (!Array.isArray(data)) return null;
        return pickBestMatch(data as CountryInfo[], geoName);
      } catch {
        return null;
      }
    })
    .catch(() => null)
    .then((value) => {
      cache.set(geoName, value);
      inflight.delete(geoName);
      return value;
    });

  inflight.set(geoName, promise);
  return promise;
}

export interface CountryInfoState {
  data: CountryInfo | null;
  loading: boolean;
  notFound: boolean;
}

export function useCountryInfo(geoName: string | null): CountryInfoState {
  const [state, setState] = useState<CountryInfoState>(() => ({
    data: geoName ? cache.get(geoName) ?? null : null,
    loading: geoName ? !cache.has(geoName) : false,
    notFound: false,
  }));

  useEffect(() => {
    if (!geoName) {
      setState({ data: null, loading: false, notFound: false });
      return;
    }
    if (cache.has(geoName)) {
      const cached = cache.get(geoName) ?? null;
      setState({ data: cached, loading: false, notFound: cached === null });
      return;
    }

    let cancelled = false;
    setState({ data: null, loading: true, notFound: false });
    fetchCountry(geoName).then((data) => {
      if (cancelled) return;
      setState({ data, loading: false, notFound: data === null });
    });
    return () => {
      cancelled = true;
    };
  }, [geoName]);

  return state;
}
