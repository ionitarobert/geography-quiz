import { Box, Typography } from '@mui/material';
import type { CountryFeature } from '../../types';
import styles from './QuizPanel.module.css';

interface Props {
  target: CountryFeature | null;
  score: number;
  total: number;
  accuracy: number;
}

export default function QuizPanel({ target, score, total, accuracy }: Props) {
  return (
    <Box component="header" className={styles.header}>
      <Typography
        variant="overline"
        color="text.secondary"
        component="p"
        className={styles.label}
      >
        Locate the country
      </Typography>

      <Typography variant="h1" component="h1" className={styles.title}>
        {target?.properties.name ?? '—'}
      </Typography>

      <Box className={styles.stats}>
        <Stat label="Correct" value={String(score)} />
        <Box className={styles.statSeparator} sx={{ bgcolor: 'divider' }} />
        <Stat label="Attempts" value={String(total)} />
        <Box className={styles.statSeparator} sx={{ bgcolor: 'divider' }} />
        <Stat label="Accuracy" value={`${accuracy}%`} />
      </Box>
    </Box>
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
