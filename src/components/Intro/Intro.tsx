import { Box, Button, Container, Typography } from '@mui/material';
import styles from './Intro.module.css';

interface Props {
  onStart: () => void;
  onExplore: () => void;
}

export default function Intro({ onStart, onExplore }: Props) {
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
            onClick={onStart}
            className={styles.cta}
          >
            Start quiz
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={onExplore}
            className={styles.cta}
          >
            Explore atlas
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
