import type { Feature, Geometry } from 'geojson';

export interface CountryProperties {
  name: string;
}

export interface CountryFeature extends Feature<Geometry, CountryProperties> {}

export type FeedbackState = null | 'correct' | 'wrong';
