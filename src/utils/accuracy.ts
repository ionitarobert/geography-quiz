export type AccuracyBand = 'novice' | 'almost' | 'expert';

export interface AccuracyVerdict {
  band: AccuracyBand;
  title: string;
  message: string;
}

export function computeAccuracy(score: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

export function getAccuracyVerdict(accuracy: number): AccuracyVerdict {
  if (accuracy < 40) {
    return {
      band: 'novice',
      title: 'Keep learning',
      message: 'The world is wide — try another round and you will improve.',
    };
  }
  if (accuracy <= 80) {
    return {
      band: 'almost',
      title: "You're almost there",
      message: 'Solid showing. A little more practice and you will master the map.',
    };
  }
  return {
    band: 'expert',
    title: "You're an expert at guessing countries",
    message: 'Outstanding — your geography is sharp.',
  };
}
