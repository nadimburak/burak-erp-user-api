import express from "express";
import { getAllEmploymentStatus } from "../../controllers/catalog/employmentStatusController";

const router = express.Router();

router.get("/employment-status", getAllEmploymentStatus);

export default router;
