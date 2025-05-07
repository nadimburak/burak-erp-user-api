import express from "express";
import {
  createInvoice,
  deleteInvoice,
  generatePdf,
  getAllInvoices,
  getInvoice,
  updateInvoice,
} from "../controllers/invoiceController";

const router = express.Router();

router.post("/invoices", createInvoice);
router.get("/invoices", getAllInvoices);
router.get("/invoices/:id", getInvoice);
router.put("/invoices/:id", updateInvoice);
router.get("/invoice-generate-pdf/:id", generatePdf);
router.delete("/invoices/:id", deleteInvoice);

export default router;
