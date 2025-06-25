import express from "express";
import { getAllGenders } from "../../controllers/catalog/genderController";

const router = express.Router();

router.get("/genders", getAllGenders);

export default router;
