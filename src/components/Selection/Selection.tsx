import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGlobePrefetch } from '../../hooks/useGlobePrefetch';
import styles from './Selection.module.css';

interface Option {
  label: string;
  path: string;
}

const OPTIONS: Option[] = [
  { label: '5', path: '/quiz/5' },
  { label: '10', path: '/quiz/10' },
  { label: '20', path: '/quiz/20' },
  { label: 'Unlimited', path: '/quiz/unlimited' },
];

export default function Selection() {
  const navigate = useNavigate();
  useGlobePrefetch();

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
              onClick={() => navigate(opt.path)}
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
