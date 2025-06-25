import express from "express";
import {
  getAllCompanyBranches,
  getCompanyBranchById,
} from "../../controllers/company/companyBranch";

const router = express.Router();

router.get("/company-branch", getAllCompanyBranches);
router.get("/company-branch/:id", getCompanyBranchById);

export default router;
