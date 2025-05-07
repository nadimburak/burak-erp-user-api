import express from "express";
import {
  deleteCustomerStatusVacancy,
  getAllCustomerStatusVacancies,
  getCustomerStatusVacancy,
} from "../controllers/vacancyApplyStatusController";

const router = express.Router();

router.get("/vacancy-status", getAllCustomerStatusVacancies);
router.get("/vacancy-status/:id", getCustomerStatusVacancy);
router.delete("/vacancy-status/:id", deleteCustomerStatusVacancy);

export default router;
