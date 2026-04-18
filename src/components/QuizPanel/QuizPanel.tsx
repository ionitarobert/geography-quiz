import type { CountryFeature } from '../../types';
import styles from './QuizPanel.module.css';

interface Props {
  target: CountryFeature | null;
  score: number;
  total: number;
}

export default function QuizPanel({ target, score, total }: Props) {
  const accuracy = total === 0 ? 0 : Math.round((score / total) * 100);

  return (
    <header className={styles.panel}>
      <p className={styles.label}>Find this country</p>
      <h1 className={styles.country}>{target?.properties.name ?? '…'}</h1>
      <div className={styles.scoreRow}>
        <p className={styles.score}>
          <strong>{score}</strong> / {total} correct
        </p>
        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-valuenow={accuracy}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Accuracy: ${accuracy}%`}
        >
          <div
            className={styles.progressFill}
            style={{ width: `${accuracy}%` }}
          />
        </div>
        <p className={styles.score}>
          <strong>{accuracy}%</strong>
        </p>
      </div>
    </header>
  );
}
