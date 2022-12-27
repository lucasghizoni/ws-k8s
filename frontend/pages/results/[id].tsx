import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {useEffect, useState} from "react";

function RandomData({ rows }: { rows: any[] }) {

  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Data
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>RandomData</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.randomData}>
              <TableCell>{row.randomData}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default function Results() {
  const [rows, setRows] = useState<any[]>([]);
  const [ws, setWs] = useState<WebSocket>();

  useEffect(() => {
    if(ws) return;
    const websocket = new WebSocket('ws://localhost:3333');

    setWs(websocket);
  }, []);

  useEffect(() => {
    if(!ws) return;
    ws.onopen = () => {
      const pathnames = window.location.pathname.split('/');
      ws.send(JSON.stringify({type: 'watcher:register', data: { id: pathnames[pathnames.length - 1] }}));
    };

    ws.onmessage = msg => {
      console.log('msg: ', msg);
      const parsedMsg = JSON.parse(msg.data);

      setRows(old => [parsedMsg, ...old].slice(0,9));
    }
  }, [ws]);

  return (
    <Box sx={{ display: 'flex' }}>
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
                <RandomData rows={rows} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
