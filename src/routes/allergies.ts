import express from "express";

import { getAllAllergies } from "../controllers/allergyController";

const router = express.Router();

router.get("/allergies", getAllAllergies);

export default router;
