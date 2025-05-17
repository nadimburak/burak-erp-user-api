import { Response } from "express";
import { AuthRequest } from "../interfaces/Auth";
import { verifyToken } from "../utils/jwt";
import User from "../models/User";

const asyncHandler = require("express-async-handler");

const modelTitle = "Middleware";

export const verifyTokenHandle = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req;

    if (!token) {
      res.status(400).json({ message: "Token is missing." });
      return;
    }
    const verified = await verifyToken(token as string);

    // Check if the token is valid
    if (!verified) {
      res.status(400).json({ message: "Invalid token." });
      return;
    }

    let user = null;
    if (typeof verified !== "string" && "userId" in verified) {
      const userId = verified.userId;
      user = await User.findById(userId);
    }

    res.status(200).json({ message: "Token Verified.", user });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Error ${modelTitle}.`, error });
  }
});