import { Request, Response } from "express";
import nodemailer from "nodemailer";
import Customer, { ICustomer } from "../models/Customer";
import { generateToken } from "../utils/jwt";
import { AuthRequest } from "../interfaces/Auth";

const asyncHandler = require("express-async-handler");
const modelTitle = "Customer";

const tokenBlacklist: Set<string> = new Set();

export const signIn = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await Customer.findOne({ email });
    if (!user) {
      res.status(404).json({ message: `${modelTitle} not found.` });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials." });
    }

    const accessToken = await generateToken(user?._id as string);

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: `Error ${modelTitle}.`, error });
  }
});

export const signUp = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: `${modelTitle} already exists.` });
    }

    const user: ICustomer = new Customer({ name, email, password });
    await user.save();

    const accessToken = await generateToken(user?._id as string);

    res
      .status(201)
      .json({ accessToken, message: `${modelTitle} registered successfully.` });
  } catch (error) {
    res.status(500).json({ message: `Error ${modelTitle}.`, error });
  }
});

export const signOut = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const token = req.token;
    // Add the token to the blacklist
    if (token) {
      tokenBlacklist.add(token);
    } else {
      res.status(400).json({ message: "Token is missing." });
      return;
    }

    res.status(200).json({ message: "Successfully signed out." });
  } catch (error) {
    res.status(500).json({ message: `Error ${modelTitle}.`, error });
  }
});

// export const getProfile = async (req: AuthRequest, res: Response) => {
//   try {
//     // Fetch the user's data from the database
//     const user = await Customer.findById(req.user._id).select("-password"); // Exclude the password
//     if (!user) {
//       res.status(404).json({ message: `${modelTitle} not found.` });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: `Error ${modelTitle}.`, error });
//   }
// };

export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const user = await Customer.findById(req.user._id)
        .select("-password")
        .populate("gender")
        .populate("marital_status");

      if (!user) {
        res.status(404).json({ message: `${modelTitle} not found.` });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);

export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        name,
        address,
        father_name,
        mother_name,
        gender,
        marital_status,
      } = req.body;

      // Find the company by ID
      const users = await Customer.findById(req.user._id);
      if (!users) {
        res.status(404).json({ message: `${modelTitle} not found.` });
      }

      // Update fields with the new data (if provided)
      const updatedProfile = await Customer.findByIdAndUpdate(
        req.user._id,
        {
          ...(name && { name }),
          ...(address && { address }),
          ...(father_name && { father_name }),
          ...(mother_name && { mother_name }),
          ...(gender && { gender }),
          ...(marital_status && { marital_status }),
        },
        { new: true } // Return the updated document
      );

      res.status(200).json({
        message: "Profile updated successfully.",
        updatedProfile,
      });
    } catch (error: any) {
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Find user by email
      const user = await Customer.findOne({ email });
      if (!user) {
        res.status(404).json({ message: `${modelTitle} not found.` });
        return;
      }

      // Generate a reset token
      const token = await generateToken(user._id as string);

      // Reset URL
      const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

      // Send Email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request",
        text: `Click this link to reset your password: ${resetUrl}`,
      });

      res.status(200).json({
        message: "Password reset email sent successfully.",
      });
    } catch (error) {
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);

export const resetPassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { newPassword } = req.body;

      // Find user by ID
      const user = await Customer.findById(req.user._id);
      if (!user) {
        res.status(404).json({ message: `${modelTitle} not found.` });
        return;
      }

      // Update the password
      user.password = newPassword; // Ensure password hashing in your model's `pre-save` middleware
      await user.save();

      res
        .status(200)
        .json({ message: "Password has been reset successfully." });
    } catch (error) {
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);
