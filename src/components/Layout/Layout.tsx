import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import HeaderBar from '../HeaderBar';
import styles from './Layout.module.css';

export default function Layout() {
  return (
    <Box className={styles.root} sx={{ bgcolor: 'background.default' }}>
      <HeaderBar />
      <Outlet />
    </Box>
  );
}
