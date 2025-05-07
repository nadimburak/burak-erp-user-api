import express from "express";
import {
  createCustomerVaccination,
  deleteCustomerVaccination,
  getAllCustomerVaccinations,
  getCustomerVaccinationById,
  updateCustomerVaccination,
} from "../controllers/customerVaccinations";

const router = express.Router();

router.post("/customer-vaccinations", createCustomerVaccination);
router.get("/customer-vaccinations", getAllCustomerVaccinations);
router.get("/customer-vaccinations/:id", getCustomerVaccinationById);
router.put("/customer-vaccinations/:id", updateCustomerVaccination);
router.delete("/customer-vaccinations/:id", deleteCustomerVaccination);

export default router;
