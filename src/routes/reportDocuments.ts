import express from "express";
import {
  createReportDocument,
  deleteReportDocument,
  generatePdf,
  getAllReportDocuments,
  getReportDocument,
  updateReportDocument,
} from "../controllers/reportDocumentController";

const router = express.Router();

router.post("/report-documents", createReportDocument);
router.get("/report-documents", getAllReportDocuments);
router.get("/report-documents/:id", getReportDocument);
router.get("/generate-pdf/:id", generatePdf);
router.put("/report-documents/:id", updateReportDocument);
router.delete("/report-documents/:id", deleteReportDocument);

export default router;
