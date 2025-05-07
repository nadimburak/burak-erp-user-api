import express from "express";
import { getAllVaccinations } from "../controllers/vaccinationController";

const router = express.Router();

router.get("/vaccinations", getAllVaccinations);

export default router;
