import { Box, Button, Container, Typography } from '@mui/material';
import type { QuestionLimit } from '../../types';
import styles from './Selection.module.css';

interface Props {
  onSelect: (limit: QuestionLimit) => void;
}

interface Option {
  label: string;
  value: QuestionLimit;
}

const OPTIONS: Option[] = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: 'Unlimited', value: null },
];

export default function Selection({ onSelect }: Props) {
  return (
    <Container maxWidth="sm" className={styles.root}>
      <Box className={styles.content}>
        <Typography variant="overline" color="text.secondary" className={styles.eyebrow}>
          Choose your round
        </Typography>

        <Typography variant="h1" component="h1" className={styles.title}>
          How many countries?
        </Typography>

        <Box className={styles.options}>
          {OPTIONS.map((opt) => (
            <Button
              key={opt.label}
              variant="outlined"
              size="large"
              onClick={() => onSelect(opt.value)}
              className={styles.option}
            >
              {opt.label}
            </Button>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
