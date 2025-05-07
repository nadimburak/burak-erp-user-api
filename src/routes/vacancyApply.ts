import express, { RequestHandler } from "express";
import {
  createCustomerVacancyApplication,
  deleteCustomerVacancy,
  getAllCustomerVacancies,
  updateCustomerVacancyStatus,
} from "../controllers/vacancyApplyController";

const router = express.Router();

router.get("/vacancy-apply", getAllCustomerVacancies);
// router.get("/vacancy-apply/:id");
router.put("/vacancy-apply/:id", updateCustomerVacancyStatus);
router.post(
  "/vacancy-apply",
  createCustomerVacancyApplication as RequestHandler
);
router.delete("/vacancy-apply/:id", deleteCustomerVacancy);

export default router;
