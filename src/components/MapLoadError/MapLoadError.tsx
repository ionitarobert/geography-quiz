import { Box, Button, Container, Typography } from '@mui/material';
import styles from './MapLoadError.module.css';

interface Props {
  onRetry: () => void;
}

export default function MapLoadError({ onRetry }: Props) {
  return (
    <Container maxWidth="sm" className={styles.root}>
      <Box className={styles.content} role="alert">
        <Typography
          variant="overline"
          color="text.secondary"
          className={styles.eyebrow}
        >
          Map unavailable
        </Typography>
        <Typography variant="h1" component="h1" className={styles.title}>
          Couldn't load the map
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          className={styles.message}
        >
          Check your connection and try again.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={onRetry}
          className={styles.cta}
        >
          Retry
        </Button>
      </Box>
    </Container>
  );
}
