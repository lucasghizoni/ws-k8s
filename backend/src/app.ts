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
  .get('/api/alive', (req, res) => {
    res.send('I am alive!')
  })
  .post('/api/users', UserController.store)
  .post('/api/users/login', UserController.login);

routes.use(authTokenMiddleware);

/* Protected routes */
routes.get('/api/user/info', UserController.info);
routes.get('/api/users', UserController.find);

app.use(routes);


export = app;