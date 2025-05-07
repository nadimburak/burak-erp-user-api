import express from "express";
import {
  createCustomerMedicalCover,
  deleteCustomerMedicalCover,
  getAllCustomerMedicalCovers,
  getCustomerMedicalCoverById,
  updateCustomerMedicalCover,
} from "../controllers/customerMedicalCoverController";

const router = express.Router();

router.post("/customer-medical-covers", createCustomerMedicalCover);
router.get("/customer-medical-covers", getAllCustomerMedicalCovers);
router.get("/customer-medical-covers/:id", getCustomerMedicalCoverById);
router.put("/customer-medical-covers/:id", updateCustomerMedicalCover);
router.delete("/customer-medical-covers/:id", deleteCustomerMedicalCover);

export default router;
