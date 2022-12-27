import dotenv from 'dotenv';
dotenv.config();

import mongoose, { connect } from 'mongoose';
import { createServer } from "http";

import app from './app';
import appWs from './appWs';

const server = createServer(app);
appWs(server);

run().catch(err => console.log(err));

async function run() {
  mongoose.set('strictQuery', true);
  await connect('mongodb://localhost:27017/subscribers');
}

server.listen(3333);

