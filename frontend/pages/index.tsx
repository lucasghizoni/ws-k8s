import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import * as React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Logout from "@mui/icons-material/Logout";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Home() {
  const { signOut, userData, getUserData } = useContext(AuthContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const [ws, setWs] = useState<WebSocket>();

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3333');
    const { 'wsk8s.token': token } = parseCookies();

    websocket.onopen = () => {
      websocket.send(JSON.stringify({ type: 'main:auth', data: { token }}));
    };

    setWs(websocket);
  }, [setWs]);

  const handleStartPolling = () => {
    if(!userData || !ws) return;
    setInterval(() => {
      const now = Date.now();

      setIsDisabled(true);

      console.log('Sending data ', now);

      ws.send(JSON.stringify({
        type: 'main:send-data',
        data: {
          id: userData.id,
          randomData: now
        }
      }));
    }, 1000);
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="absolute">
        <Toolbar
          sx={{
            pr: '24px', // keep right padding when drawer closed
          }}
        >
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Dashboard
          </Typography>
          <span style={{paddingRight: '0.5rem'}}>{userData && userData.name}</span>
          <Logout onClick={signOut} sx={{ cursor: 'pointer' }} />
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Button disabled={isDisabled} onClick={handleStartPolling}>Start</Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['wsk8s.token']: token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      }
    }
  }
  return {
    props: {}
  }
}