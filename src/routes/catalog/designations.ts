import express from "express";
import {
  getAllDesignations
} from "../../controllers/catalog/designationController";

const router = express.Router();

router.get("/designations", getAllDesignations);

export default router;
