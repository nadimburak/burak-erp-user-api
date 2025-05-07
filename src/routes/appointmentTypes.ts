import express from "express";
import { getAllAppointmentTypes } from "../controllers/appointmentTypeController";

const router = express.Router();

router.get("/appointment-types", getAllAppointmentTypes);

export default router;
