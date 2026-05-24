import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <Container maxWidth="sm" className={styles.root}>
        <Box className={styles.content}>
          <Typography
            variant="overline"
            color="text.secondary"
            className={styles.eyebrow}
          >
            Something went wrong
          </Typography>

          <Typography variant="h1" component="h1" className={styles.title}>
            The map slipped away
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            className={styles.message}
          >
            An unexpected error occurred. Reloading usually puts things right.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={this.handleReload}
            className={styles.cta}
          >
            Reload
          </Button>

          <Box
            component="details"
            className={styles.details}
            sx={{ color: 'text.secondary' }}
          >
            <summary>Error details</summary>
            <Box className={styles.detailsBody} sx={{ color: 'text.primary' }}>
              {this.state.error.message}
              {this.state.error.stack ? `\n\n${this.state.error.stack}` : ''}
            </Box>
          </Box>
        </Box>
      </Container>
    );
  }
}
