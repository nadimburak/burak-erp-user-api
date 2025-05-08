import express from "express";
import {
  createCustomerApplyAppointment,
  deleteCustomerApplyAppointment,
  getAllCustomerApplyAppointment,
  getCustomerApplyAppointment,
  updateCustomerApplyAppointment,
} from "../controllers/applyAppointmentController";

const router = express.Router();

router.post("/apply-appointment", createCustomerApplyAppointment);
router.get("/apply-appointment", getAllCustomerApplyAppointment);
router.get("/apply-appointment/:id", getCustomerApplyAppointment);
router.put("/apply-appointment/:id", updateCustomerApplyAppointment);
router.delete("/apply-appointment/:id", deleteCustomerApplyAppointment);

export default router;
