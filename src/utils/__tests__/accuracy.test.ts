import { describe, it, expect } from 'vitest';
import { computeAccuracy, getAccuracyVerdict } from '../accuracy';

describe('computeAccuracy', () => {
  it('returns 0 when total is 0 (avoid division by zero)', () => {
    expect(computeAccuracy(0, 0)).toBe(0);
  });

  it('returns 100 for a perfect score', () => {
    expect(computeAccuracy(10, 10)).toBe(100);
  });

  it('returns 0 for a complete miss', () => {
    expect(computeAccuracy(0, 5)).toBe(0);
  });

  it('rounds to the nearest integer', () => {
    expect(computeAccuracy(1, 3)).toBe(33);
    expect(computeAccuracy(2, 3)).toBe(67);
    expect(computeAccuracy(7, 12)).toBe(58);
  });
});

describe('getAccuracyVerdict', () => {
  it('returns "novice" below 40%', () => {
    expect(getAccuracyVerdict(0).band).toBe('novice');
    expect(getAccuracyVerdict(39).band).toBe('novice');
  });

  it('returns "almost" between 40% and 80% inclusive', () => {
    expect(getAccuracyVerdict(40).band).toBe('almost');
    expect(getAccuracyVerdict(60).band).toBe('almost');
    expect(getAccuracyVerdict(80).band).toBe('almost');
  });

  it('returns "expert" above 80%', () => {
    expect(getAccuracyVerdict(81).band).toBe('expert');
    expect(getAccuracyVerdict(100).band).toBe('expert');
  });
});
