import express from "express";
import {
  getAllMaritalStatus
} from "../../controllers/catalog/maritalStatusController";

const router = express.Router();

router.get("/marital-status", getAllMaritalStatus);

export default router;
