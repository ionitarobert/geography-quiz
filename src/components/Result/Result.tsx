import { Box, Button, Container, Typography } from '@mui/material';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getAccuracyVerdict } from '../../utils';
import type { QuizResult } from '../../types';
import styles from './Result.module.css';

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state as QuizResult | null;

  if (!result) {
    return <Navigate to="/select" replace />;
  }

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
          onClick={() => navigate('/select')}
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
