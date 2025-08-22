import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import {
  clearUserCart,
  createUserCart,
  deleteUserCart,
  getUserCarts,
} from "../../controllers/shopping/userCartController";

const router = express.Router();

router.use(authenticate);

router.get("/user-carts", getUserCarts);
router.post("/user-carts", createUserCart);
router.delete("/user-carts/:id", deleteUserCart);
router.delete("/user-carts", clearUserCart);

export default router;
