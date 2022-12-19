import dotenv from 'dotenv';
dotenv.config();

import mongoose, { connect } from 'mongoose';
import express, { Router } from 'express';
import { createServer } from "http";
import { WebSocketServer } from 'ws';

import UserController from "./controllers/UserController";
import { authToken } from "./middlewares";

const app = express();
const server = createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
  console.log('A new client connected');

  ws.on('message', msg => {
    console.log('new message: ', msg);
  });
});

run().catch(err => console.log(err));

async function run() {
  mongoose.set('strictQuery', true);
  await connect('mongodb://localhost:27017/subscribers');
}

app.use(express.json());

const routes = Router();

/* Public routes */
routes
  .post('/users', UserController.store)
  .post('/users/login', UserController.login);

routes.use(authToken);

/* Protected routes */
routes.get('/users', UserController.find);

app.use(routes);

server.listen(3000);

