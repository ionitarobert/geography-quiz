import { Box, Paper, Typography } from '@mui/material';
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
  const accent = isCorrect ? 'success.main' : 'error.main';

  return (
    <Paper
      elevation={0}
      role="status"
      aria-live="polite"
      className={styles.paper}
      sx={{
        bgcolor: 'background.paper',
        border: 1,
        borderColor: accent,
      }}
    >
      <Box
        aria-hidden
        className={styles.icon}
        sx={{ border: 1, borderColor: accent, color: accent }}
      >
        {isCorrect ? '✓' : '✕'}
      </Box>
      <Typography variant="body2" className={styles.text}>
        {isCorrect ? (
          <>
            Correct — <span className={styles.emphasis}>{correctName}</span>
          </>
        ) : (
          <>
            You chose <span className={styles.emphasis}>{clickedName}</span>
            {' '}— answer was <span className={styles.emphasis}>{correctName}</span>
          </>
        )}
      </Typography>
    </Paper>
  );
}
