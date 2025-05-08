import express from "express";
import {
  createCustomerLanguage,
  deleteCustomerLanguage,
  getAllCustomerLanguages,
  getCustomerLanguageById,
  updateCustomerLanguage,
} from "../controllers/customerLanguageController";

const router = express.Router();

router.post("/customer-languages", createCustomerLanguage);
router.get("/customer-languages", getAllCustomerLanguages);
router.get("/customer-languages/:id", getCustomerLanguageById);
router.put("/customer-languages/:id", updateCustomerLanguage);
router.delete("/customer-languages/:id", deleteCustomerLanguage);

export default router;
