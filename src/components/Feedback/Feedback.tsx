import type { FeedbackState } from '../../types';
import styles from './Feedback.module.css';

interface Props {
  feedback: FeedbackState;
  correctName: string;
  clickedName: string;
}

export default function Feedback({ feedback, correctName, clickedName }: Props) {
  if (!feedback) return null;

  const isCorrect = feedback === 'correct';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${styles.overlay} ${isCorrect ? styles.correct : styles.wrong}`}
    >
      <span className={styles.icon} aria-hidden="true">
        {isCorrect ? '✓' : '✕'}
      </span>
      <span className={styles.message}>
        {isCorrect ? (
          <>Correct! That's <em>{correctName}</em></>
        ) : (
          <>You clicked <em>{clickedName}</em> — answer was <em>{correctName}</em></>
        )}
      </span>
    </div>
  );
}
