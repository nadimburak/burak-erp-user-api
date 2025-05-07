import express from "express";
import { getAllCompanyService } from "../../controllers/company/companyServiceController";

const router = express.Router();

router.get("/company-services", getAllCompanyService);

export default router;
