import express from "express";
import { getAllCityLocation } from "../../controllers/location/cityLocationsController";

const router = express.Router();

router.get("/city-location", getAllCityLocation);

export default router;
