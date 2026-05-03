import { Box, Button, Container, Typography } from '@mui/material';
import { getAccuracyVerdict } from '../../utils';
import type { QuizResult } from '../../types';
import styles from './Result.module.css';

interface Props {
  result: QuizResult;
  onPlayAgain: () => void;
}

export default function Result({ result, onPlayAgain }: Props) {
  const { score, total, accuracy } = result;
  const verdict = getAccuracyVerdict(accuracy);

  return (
    <Container maxWidth="sm" className={styles.root}>
      <Box className={styles.content}>
        <Typography variant="overline" color="text.secondary" className={styles.eyebrow}>
          Round complete
        </Typography>

        <Typography variant="h1" component="h1" className={styles.title}>
          {verdict.title}
        </Typography>

        <Typography variant="body1" color="text.secondary" className={styles.message}>
          {verdict.message}
        </Typography>

        <Box className={styles.stats}>
          <Stat label="Correct" value={`${score} / ${total}`} />
          <Box className={styles.statSeparator} sx={{ bgcolor: 'divider' }} />
          <Stat label="Accuracy" value={`${accuracy}%`} />
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={onPlayAgain}
          className={styles.cta}
        >
          Play again
        </Button>
      </Box>
    </Container>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Box className={styles.statBlock}>
      <Typography variant="h2" component="p" className={styles.statValue}>
        {value}
      </Typography>
      <Typography variant="overline" color="text.secondary" component="p">
        {label}
      </Typography>
    </Box>
  );
}
