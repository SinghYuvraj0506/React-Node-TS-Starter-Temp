import express from "express";
import authRouter from "./auth.routes";

const router = express.Router();

export default () => {
  authRouter(router);
  return router;
};
