import express from "express";
import { getAllCountry } from "../../controllers/location/countryLocationsController";

const router = express.Router();

router.get("/countries", getAllCountry);

export default router;
