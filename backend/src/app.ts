import cors from "cors";
import express, { Router } from "express";
import UserController from "./controllers/UserController";
import { authTokenMiddleware } from "./middlewares";

const app = express();

app.use(cors());
app.use(express.json());

const routes = Router();

/* Public routes */
routes
  .post('/users', UserController.store)
  .post('/users/login', UserController.login);

routes.use(authTokenMiddleware);

/* Protected routes */
routes.get('/user/info', UserController.info);
routes.get('/users', UserController.find);

app.use(routes);


export = app;