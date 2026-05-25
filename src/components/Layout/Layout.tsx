import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Outlet } from 'react-router-dom';
import HeaderBar from '../HeaderBar';
import styles from './Layout.module.css';

function RouteFallback() {
  return (
    <Box className={styles.fallback} aria-busy="true">
      <CircularProgress size={28} thickness={3} color="inherit" />
    </Box>
  );
}

export default function Layout() {
  return (
    <Box className={styles.root} sx={{ bgcolor: 'background.default' }}>
      <HeaderBar />
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    </Box>
  );
}
