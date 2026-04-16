import type { CountryFeature } from '../../types';
import styles from './QuizPanel.module.css';

interface Props {
  target: CountryFeature | null;
  score: number;
  total: number;
}

export default function QuizPanel({ target, score, total }: Props) {
  return (
    <div className={styles.panel}>
      <p className={styles.label}>Find this country:</p>
      <h1 className={styles.country}>{target?.properties.name ?? '...'}</h1>
      <p className={styles.score}>
        Score: <strong>{score}</strong> / {total}
      </p>
    </div>
  );
}
