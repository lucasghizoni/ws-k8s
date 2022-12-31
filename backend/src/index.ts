import dotenv from 'dotenv';

if(process.env.NODE_ENV === 'development') {
  dotenv.config();
}

import mongoose, { connect } from 'mongoose';
import { createServer } from "http";

import app from './app';
import appWs from './appWs';

const server = createServer(app);
appWs(server);

run().catch(err => console.log(err));

async function run() {
  mongoose.set('strictQuery', true);
  await connect(
    `mongodb://${process.env.MONGODB_ADMINUSERNAME}:${process.env.MONGODB_ADMINPASSWORD}@${process.env.MONGODB_SERVER}/subscribers?authSource=admin`
  );
}

server.listen(3333);

