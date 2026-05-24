import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { CountryFeature, QuestionLimit } from '../../types';

const fixture: CountryFeature[] = [
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [0, 0] },
    properties: { name: 'Atlantis' },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [0, 0] },
    properties: { name: 'Brobdingnag' },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [0, 0] },
    properties: { name: 'Carcosa' },
  },
];

vi.mock('../useCountries', () => ({
  useCountries: () => ({
    countries: fixture,
    loading: false,
    error: null,
    retry: () => {},
  }),
}));

import { useQuiz } from '../useQuiz';

describe('useQuiz', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with a target country and zero score', () => {
    const { result } = renderHook(() => useQuiz(5));
    expect(result.current.target).not.toBeNull();
    expect(fixture).toContain(result.current.target);
    expect(result.current.score).toBe(0);
    expect(result.current.total).toBe(0);
    expect(result.current.finished).toBe(false);
  });

  it('increments score on a correct click and resets feedback after delay', () => {
    const { result } = renderHook(() => useQuiz(5));
    const target = result.current.target!;

    act(() => {
      result.current.handleCountryClick(target);
    });
    expect(result.current.feedback).toBe('correct');
    expect(result.current.score).toBe(1);
    expect(result.current.total).toBe(1);

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(result.current.feedback).toBeNull();
    expect(result.current.lastClicked).toBeNull();
  });

  it('does not increment score on a wrong click, but increments total', () => {
    const { result } = renderHook(() => useQuiz(5));
    const target = result.current.target!;
    const wrong = fixture.find((c) => c !== target)!;

    act(() => {
      result.current.handleCountryClick(wrong);
    });
    expect(result.current.feedback).toBe('wrong');
    expect(result.current.score).toBe(0);
    expect(result.current.total).toBe(1);
  });

  it('ignores clicks while feedback is showing', () => {
    const { result } = renderHook(() => useQuiz(5));
    const target = result.current.target!;

    act(() => {
      result.current.handleCountryClick(target);
    });
    expect(result.current.total).toBe(1);

    act(() => {
      result.current.handleCountryClick(target);
    });
    expect(result.current.total).toBe(1);
  });

  it('marks the quiz finished after reaching the limit', () => {
    const LIMIT: QuestionLimit = 5;
    const { result } = renderHook(() => useQuiz(LIMIT));

    for (let i = 0; i < LIMIT; i++) {
      const target = result.current.target!;
      act(() => {
        result.current.handleCountryClick(target);
      });
      act(() => {
        vi.advanceTimersByTime(1500);
      });
    }

    expect(result.current.finished).toBe(true);
    expect(result.current.total).toBe(LIMIT);
    expect(result.current.score).toBe(LIMIT);
  });
});
