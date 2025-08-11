import express from "express";
import { createUserChat, getUserChat } from "../../controllers/chat/userChatController";
import { authenticate } from "../../middlewares/auth";

const router = express.Router();

router.use(authenticate);

router.get("/user-chats", getUserChat);
router.post("/user-chats", createUserChat);

export default router;