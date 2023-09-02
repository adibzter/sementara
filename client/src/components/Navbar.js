import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Home from '@mui/icons-material/Home';
import Upload from '@mui/icons-material/Upload';
import Download from '@mui/icons-material/Download';
import Paper from '@mui/material/Paper';

import { usePageStore } from '../stores/pageStore';

const pageMap = ['', 'send', 'receive'];

export default function Navbar() {
  const ref = useRef(null);

  const [page, setPage] = usePageStore((state) => [state.page, state.setPage]);

  const navigate = useNavigate();

  useEffect(() => {
    const initialPage = window.location.pathname.split('/')[1];
    setPage(initialPage);
  }, []);

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={pageMap.indexOf(page)}
          onChange={(event, newValue) => {
            setTimeout(() => {
              navigate(`/${pageMap[newValue]}`);
            }, 100);
          }}
        >
          <BottomNavigationAction label='Home' icon={<Home />} />
          <BottomNavigationAction label='Send' icon={<Upload />} />
          <BottomNavigationAction label='Receive' icon={<Download />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
