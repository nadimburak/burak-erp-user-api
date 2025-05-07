import express from "express";
import { getAllMedicalConditions } from "../controllers/medicalConditionController";

const router = express.Router();

router.get("/medical-conditions", getAllMedicalConditions);

export default router;
