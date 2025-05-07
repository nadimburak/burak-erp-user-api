import express from "express";
import {
  createCustomerAllergy,
  deleteCustomerAllergy,
  getAllCustomerAllergy,
  getCustomerAllergyById,
  updateCustomerAllergy,
} from "../controllers//customerAllergyController";

const router = express.Router();

router.post("/customer-allergies", createCustomerAllergy);
router.get("/customer-allergies", getAllCustomerAllergy);
router.get("/customer-allergies/:id", getCustomerAllergyById);
router.put("/customer-allergies/:id", updateCustomerAllergy);
router.delete("/customer-allergies/:id", deleteCustomerAllergy);

export default router;
