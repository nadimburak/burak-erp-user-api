import express from "express";
import {
  createCustomerMedicalCondition,
  deleteCustomerMedicalCondition,
  getAllCustomerMedicalCondition,
  getCustomerMedicalConditionById,
  updateCustomerMedicalCondition,
} from "../controllers/customerMedicalConditionController";

const router = express.Router();

router.post("/customer-medical-conditions", createCustomerMedicalCondition);
router.get("/customer-medical-conditions", getAllCustomerMedicalCondition);
router.get("/customer-medical-conditions/:id", getCustomerMedicalConditionById);
router.put("/customer-medical-conditions/:id", updateCustomerMedicalCondition);
router.delete(
  "/customer-medical-conditions/:id",
  deleteCustomerMedicalCondition
);

export default router;
