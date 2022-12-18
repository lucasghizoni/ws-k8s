import dotenv from 'dotenv';
dotenv.config();

import mongoose, { connect } from 'mongoose';
import express, { Router } from 'express';

import UserController from "./controllers/UserController";
import { authToken } from "./middlewares";

const app = express();

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

app.listen(3000);

