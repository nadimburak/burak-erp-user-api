import express from "express";
import {
  generatePdf,
  getAllPrescriptions,
  getPrescriptionsById,
} from "../controllers/prescriptionController";

const router = express.Router();

router.get("/prescriptions", getAllPrescriptions);
router.get("/prescriptions/:id", getPrescriptionsById);
router.get("/prescription-generate-pdf/:id", generatePdf);

export default router;
