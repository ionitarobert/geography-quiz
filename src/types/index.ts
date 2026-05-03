import type { Feature, Geometry } from 'geojson';

export interface CountryProperties {
  name: string;
}

export interface CountryFeature extends Feature<Geometry, CountryProperties> {}

export type FeedbackState = null | 'correct' | 'wrong';

export type Stage = 'intro' | 'select' | 'quiz' | 'result' | 'atlas';

export type QuestionLimit = 5 | 10 | 20 | null;

export interface QuizResult {
  score: number;
  total: number;
  accuracy: number;
}

export interface Currency {
  code: string;
  name: string;
  symbol?: string;
}

export interface Language {
  iso639_1?: string;
  iso639_2?: string;
  name: string;
  nativeName?: string;
}

export interface CountryInfo {
  name: string;
  nativeName?: string;
  capital?: string;
  region?: string;
  subregion?: string;
  population?: number;
  area?: number;
  latlng?: [number, number];
  borders?: string[];
  currencies?: Currency[];
  languages?: Language[];
  flag?: string;
  flags?: { svg?: string; png?: string };
  callingCodes?: string[];
  timezones?: string[];
  alpha3Code?: string;
  demonym?: string;
}
