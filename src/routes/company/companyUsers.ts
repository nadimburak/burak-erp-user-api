import express from "express";
import { getAllCompanyUsers } from "../../controllers/company/companyUserController";

const router = express.Router();

router.get("/company-users", getAllCompanyUsers);

export default router;
