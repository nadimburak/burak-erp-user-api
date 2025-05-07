import express from "express";
import { getAllCompanies } from "../../controllers/company/companyController";

const router = express.Router();

router.get("/companies", getAllCompanies);

export default router;
