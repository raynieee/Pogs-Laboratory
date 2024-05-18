import express from "express";
import cors from 'cors';
import pogs from './pogs';
import login from './auth/login';
import signup from './auth/signup';
import market from "./market";
import priceChange from "./priceChange";
import profile from "./profile";

function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  pogs(app);
  login(app);
  signup(app);
  market(app);
  priceChange(app);
  profile(app);

  return app;
}

export default createServer;