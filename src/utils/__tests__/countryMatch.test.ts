import { describe, it, expect } from 'vitest';
import { apiQueryForName, pickBestMatch } from '../countryMatch';
import type { CountryInfo } from '../../types';

function makeCountry(name: string): CountryInfo {
  return { name };
}

describe('apiQueryForName', () => {
  it('maps GeoJSON name to REST Countries name when an override exists', () => {
    expect(apiQueryForName('United States of America')).toBe('United States');
    expect(apiQueryForName('Russia')).toBe('Russian Federation');
    expect(apiQueryForName('Vietnam')).toBe('Viet Nam');
    expect(apiQueryForName('Czech Republic')).toBe('Czechia');
    expect(apiQueryForName('Ivory Coast')).toBe("Côte d'Ivoire");
  });

  it('returns the input unchanged when no override exists', () => {
    expect(apiQueryForName('Germany')).toBe('Germany');
    expect(apiQueryForName('Japan')).toBe('Japan');
  });

  it('does not match case-insensitively (overrides are exact)', () => {
    // The override table is keyed by the GeoJSON casing; anything else falls
    // through to the input. This locks in current behavior so a future refactor
    // is forced to consider casing explicitly.
    expect(apiQueryForName('russia')).toBe('russia');
  });
});

describe('pickBestMatch', () => {
  it('returns null for an empty list', () => {
    expect(pickBestMatch([], 'Germany')).toBeNull();
  });

  it('finds an exact case-insensitive match first', () => {
    const results = [
      makeCountry('Germany Holdings'),
      makeCountry('Germany'),
    ];
    expect(pickBestMatch(results, 'Germany')?.name).toBe('Germany');
  });

  it('uses the override target when searching, not the raw GeoJSON name', () => {
    const results = [
      makeCountry('United States'),
      makeCountry('Mexico'),
    ];
    const match = pickBestMatch(results, 'United States of America');
    expect(match?.name).toBe('United States');
  });

  it('falls back to startsWith when no exact match', () => {
    const results = [
      makeCountry('Iran (Islamic Republic of)'),
      makeCountry('Iraq'),
    ];
    const match = pickBestMatch(results, 'Iran');
    expect(match?.name).toBe('Iran (Islamic Republic of)');
  });

  it('returns the first result when no exact and no startsWith match', () => {
    const results = [
      makeCountry('Republic of Foo'),
      makeCountry('Republic of Bar'),
    ];
    const match = pickBestMatch(results, 'Zulu');
    expect(match?.name).toBe('Republic of Foo');
  });
});
