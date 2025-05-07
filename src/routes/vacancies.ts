import express from "express";
import {
  // createCustomerVacancy,
  deleteCustomerVacancy,
  getAllCustomerVacancies,
  getCustomerVacancy,
  // updateCustomerVacancyStatus,
  // updateCustomerVacancy,
} from "../controllers/vacancyController";

const router = express.Router();

router.get("/vacancies", getAllCustomerVacancies);
router.get("/vacancies/:id", getCustomerVacancy);
// router.put("/vacancies/:id", updateCustomerVacancyStatus);
// router.post("/vacancies", createCustomerVacancy);
// router.put("/vacancies/:id", updateCustomerVacancy);
router.delete("/vacancies/:id", deleteCustomerVacancy);

export default router;
