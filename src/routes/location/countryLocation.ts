import express from "express";
import { getAllCountryLocation } from "../../controllers/location/countryLocationsController";

const router = express.Router();

router.get("/country-location", getAllCountryLocation);

export default router;
