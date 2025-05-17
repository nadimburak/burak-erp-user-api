import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { verifyTokenHandle } from "../controllers/middleController";

const router = express.Router();

router.use(authenticate);

router.get("/verify-token", verifyTokenHandle);

export default router;
