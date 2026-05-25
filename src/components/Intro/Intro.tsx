import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGlobePrefetch } from '../../hooks/useGlobePrefetch';
import styles from './Intro.module.css';

export default function Intro() {
  const navigate = useNavigate();
  useGlobePrefetch();

  return (
    <Container maxWidth="sm" className={styles.root}>
      <Box className={styles.content}>
        <Typography variant="overline" color="text.secondary" className={styles.eyebrow}>
          Atlas · Geography Quiz
        </Typography>

        <Typography variant="h1" component="h1" className={styles.title}>
          Welcome, traveller
        </Typography>

        <Typography variant="body1" color="text.secondary" className={styles.lede}>
          Spin the globe, find the country, and see how well you know the world.
        </Typography>

        <Box className={styles.actions}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/select')}
            className={styles.cta}
          >
            Start quiz
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/atlas')}
            className={styles.cta}
          >
            Explore atlas
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
