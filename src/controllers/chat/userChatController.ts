import { Response } from "express";
import UserChat from "../../models/chat/UserChat";
import { AuthRequest } from "../../interfaces/Auth";

const asyncHandler = require("express-async-handler");

const modelTitle = "User Chat";

export const getUserChat = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const user = req?.user?._id;
      const {
        page = "1",
        limit = "10",
        sortBy = "created_at", // Changed default sort to createdAt
        order = "desc", // Changed default order to show newest first
        search = "",
        userId
      } = req.query;

      // Validate that userId is provided for chat conversations
      if (!userId) {
        return res.status(400).json({ message: "User ID is required for chat" });
      }

      const parsedPage = Math.max(parseInt(page as string, 10), 1);
      const parsedLimit = Math.max(parseInt(limit as string, 10), 1);
      const sortOrder = order === "asc" ? 1 : -1;

      const query: any = search
        ? {
          $or: [
            { text: { $regex: search, $options: "i" } }, // Case-insensitive match for name
            { sender: user, recipient: userId },
            { sender: userId, recipient: user }
          ],
        }
        : {};

      // Fetch data with sorting and pagination
      const data = await UserChat.find(query)
        .populate("sender", "name email image")
        .populate("recipient", "name email image")
        .sort({ [sortBy as string]: sortOrder })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);

      // Get the total number of messages in this conversation
      const totalData = await UserChat.countDocuments(query);

      res.status(200).json({
        success: true,
        data,
        total: totalData,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalData / parsedLimit),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error fetching ${modelTitle}.`,
        error: error
      });
    }
  }
);

export const createUserChat = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const user = req?.user?._id;
      const { recipient, text } = req.body;

      if (!recipient || !text) {
        return res.status(400).json({
          success: false,
          message: "Recipient and text are required"
        });
      }

      const newMessage = new UserChat({
        sender: user,
        recipient,
        text,
      });

      await newMessage.save();

      // Populate sender and recipient details
      const populatedMessage = await UserChat.populate(newMessage, [
        { path: "sender", select: "name email image" },
        { path: "recipient", select: "name email image" }
      ]);

      // Emit the new message via Socket.io if available
      const io = req.app.get('io');
      if (io) {
        io.to(`user_${recipient}`).emit('new_message', {
          message: populatedMessage,
          conversationId: `${user}_${recipient}`
        });

        // Also emit to sender for real-time update in their own client
        io.to(`user_${user}`).emit('new_message', {
          message: populatedMessage,
          conversationId: `${user}_${recipient}`
        });
      }

      res.status(201).json({
        success: true,
        data: populatedMessage,
        message: "Message sent successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error sending message",
        error: error.message
      });
    }
  }
);

// Additional controller for real-time status updates
export const updateMessageStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const user = req?.user?._id;
      const { messageId, status } = req.body;

      if (!messageId || !status) {
        return res.status(400).json({
          success: false,
          message: "Message ID and status are required"
        });
      }

      const updatedMessage = await UserChat.findOneAndUpdate(
        { _id: messageId, recipient: user },
        { status },
        { new: true }
      ).populate("sender", "name email image");

      if (!updatedMessage) {
        return res.status(404).json({
          success: false,
          message: "Message not found"
        });
      }

      // Notify sender about the status update
      const io = req.app.get('io');
      if (io) {
        io.to(`user_${updatedMessage.sender._id}`).emit('message_status', {
          messageId: updatedMessage._id,
          status,
          updatedAt: updatedMessage.updated_at
        });
      }

      res.status(200).json({
        success: true,
        data: updatedMessage,
        message: "Message status updated",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error updating message status",
        error: error.message
      });
    }
  }
);