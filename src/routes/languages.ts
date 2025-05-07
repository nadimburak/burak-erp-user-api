import express from "express";
import { getAllLanguages } from "../controllers/languageController";

const router = express.Router();

router.get("/languages", getAllLanguages);

export default router;
