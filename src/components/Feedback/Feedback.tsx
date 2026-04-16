import type { FeedbackState } from '../../types';
import styles from './Feedback.module.css';

interface Props {
  feedback: FeedbackState;
  correctName: string;
  clickedName: string;
}

export default function Feedback({ feedback, correctName, clickedName }: Props) {
  if (!feedback) return null;

  return (
    <div className={`${styles.overlay} ${feedback === 'correct' ? styles.correct : styles.wrong}`}>
      {feedback === 'correct' ? (
        <span>Correct!</span>
      ) : (
        <span>Wrong — you clicked <em>{clickedName}</em>, the answer was <em>{correctName}</em></span>
      )}
    </div>
  );
}
