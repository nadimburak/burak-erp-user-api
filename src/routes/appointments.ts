import express from "express";
import {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  getAppointment,
  updateAppointment,
} from "../controllers/appointmentController";

const router = express.Router();

router.post("/appointments", createAppointment);
router.get("/appointments", getAllAppointments);
router.get("/appointments/:id", getAppointment);
router.put("/appointments/:id", updateAppointment);
router.delete("/appointments/:id", deleteAppointment);

export default router;
