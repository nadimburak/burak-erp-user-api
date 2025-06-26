import express from "express";
import { getAllIndustries } from "../../controllers/catalog/industryController";

const router = express.Router();

router.get("/industry", getAllIndustries);

export default router;
