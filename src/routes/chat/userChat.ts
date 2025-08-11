import express from "express";
import { createUserChat, getAllChatList, getUserChat } from "../../controllers/chat/userChatController";
import { authenticate } from "../../middlewares/auth.middleware";

const router = express.Router();

router.use(authenticate);

router.get("/all-user-chats", getAllChatList);
router.get("/user-chats", getUserChat);
router.post("/user-chats", createUserChat);

export default router;