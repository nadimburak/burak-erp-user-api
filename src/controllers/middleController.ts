import { Response } from "express";
import { AuthRequest } from "../interfaces/Auth";
import { verifyToken } from "../utils/jwt";

const asyncHandler = require("express-async-handler");

const modelTitle = "Middleware";

export const verifyTokenHandle = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req;

    if (!token) {
      res.status(400).json({ message: "Token is missing." });
      return;
    }
    const decodedToken = await verifyToken(token as string);

    // Check if the token is valid
    if (!decodedToken) {
      res.status(400).json({ message: "Invalid token." });
      return;
    }

    res.status(200).json({ message: "Token Verified." });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Error ${modelTitle}.`, error });
  }
});