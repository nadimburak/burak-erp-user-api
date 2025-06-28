import express from "express";
import {
    getAllStateLocation
} from "../../controllers/location/stateLocationsController";

const router = express.Router();

router.get("/state-location", getAllStateLocation);

export default router;
