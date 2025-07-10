import express from "express";
import {
    getAllState
} from "../../controllers/location/stateLocationsController";

const router = express.Router();

router.get("/states", getAllState);

export default router;
