import express from "express";
import {
  createCustomerDocument,
  deleteCustomerDocument,
  getAllCustomerDocument,
  getCustomerDocumentById,
  updateCustomerDocument,
} from "../controllers/customerDocumentController";

const router = express.Router();

router.post("/customer-documents", createCustomerDocument);
router.get("/customer-documents", getAllCustomerDocument);
router.get("/customer-documents/:id", getCustomerDocumentById);
router.put("/customer-documents/:id", updateCustomerDocument);
router.delete("/customer-documents/:id", deleteCustomerDocument);

export default router;
