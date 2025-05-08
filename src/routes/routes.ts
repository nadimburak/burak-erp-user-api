import express from "express";

import authRoutes from "./auth";

import { authenticate } from "../middlewares/auth.middleware";

const customerRouter = express.Router();

// Combine routes
customerRouter.use("/auth", [authRoutes]);

customerRouter.use(authenticate);

export default customerRouter;
