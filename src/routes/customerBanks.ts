import express from "express";
import {
  createCustomerBank,
  deleteCustomerBank,
  getAllCustomerBank,
  getCustomerBankById,
  updateCustomerBank,
} from "../controllers/customerBankController";

const router = express.Router();

router.post("/customer-banks",createCustomerBank);
router.get("/customer-banks", getAllCustomerBank);
router.get("/customer-banks/:id", getCustomerBankById);
router.put("/customer-banks/:id", updateCustomerBank);
router.delete("/customer-banks/:id", deleteCustomerBank);

export default router;
