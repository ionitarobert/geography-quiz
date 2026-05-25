import { useEffect } from 'react';
import { loadCountries } from './useCountries';

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

export function useGlobePrefetch(): void {
  useEffect(() => {
    const prefetch = () => {
      void import('../components/GlobeView');
      loadCountries().catch(() => {});
    };
    const w = window as IdleWindow;
    if (typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(prefetch, { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(prefetch, 500);
    return () => window.clearTimeout(id);
  }, []);
}
