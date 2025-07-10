import express from "express";
import { getAllCity } from "../../controllers/location/cityLocationsController";

const router = express.Router();

router.get("/cities", getAllCity);

export default router;
