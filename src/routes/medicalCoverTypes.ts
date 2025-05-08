import express from "express";
import { getAllMedicalCoverTypes } from "../controllers/medicalCoverTypeController";

const router = express.Router();

router.get("/medical-cover-types", getAllMedicalCoverTypes);

export default router;
