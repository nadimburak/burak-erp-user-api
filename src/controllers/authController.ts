import bcrypt from "bcrypt";
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { AuthRequest, tokenBlacklist } from "../interfaces/Auth";
import User, { IUser } from "../models/User";
import { generateToken, verifyToken } from "../utils/jwt";
import Company from "../models/company/Company";

const asyncHandler = require("express-async-handler");

const modelTitle = "User";

export const signIn = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password, type } = req.body;

    if (!email || !password || !type) {
      return res
        .status(400)
        .json({ message: "Email, password, and user type are required." });
    }

    const user = await User.findOne({ email, type }).select("+password");

    if (!user) {
      return res.status(404).json({ message: `${type} not found.` });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const accessToken = await generateToken(user?._id as string);

    res.status(200).json({ accessToken });
  } catch (error: any) {
    res.status(500).json({ message: `Error ${modelTitle}.`, error });
  }
});

export const signUp = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists." });
    }

    const user: IUser = new User({ name, email, password });
    await user.save();

    const accessToken = await generateToken(user?._id as string);

    res
      .status(201)
      .json({ accessToken, message: "User registered successfully." });
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

export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { _id, type } = req.user;

    // Create the base query
    const query = User.findById(_id)
      .select("-password")
      .populate("company_branch", "name") // 👈 Populate company_branch name only;
      .populate("gender", "name")
      .populate("role", "name")
      .populate("language", "name")
      .populate("employment_status", "name")
      .populate("marital_status", "name")
      .populate("designation", "name")
      .populate("country", "name")
      .populate("state", "name")
      .populate("city", "name")
      .populate(
        type === "company_user" || type === "customer" ? "company" : ""
      );

    try {
      const user = await query.exec();

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const userCount = await User.countDocuments({});
      const companyCount = await Company.countDocuments({});
    

      res.status(200).json({
        ...user.toObject(),
        no_of_users: userCount, // ⬅️ Ye field tumhare frontend me milega
        no_of_company: companyCount, // ⬅️ Ye field tumhare frontend me milega
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return res.status(500).json({
        message: `Error fetching user profile.`,
      });
    }
  }
);

export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        name,
        mobile,
        company_branch,
        gender,
        language,
        mother_name,
        father_name,
        employment_status,
        marital_status,
        password,
        new_password,
        confirm_password,
        passport_number,
        spouse_name,
        dob,
        ethnicity,
        sexuality,
        driver,
        pets,
        emergency_contact_number,
        legal_guardians_details,
        designation,
        dependents,
        country,
        state,
        city,
        zip_code,
        image,
        address,
      } = req.body;

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // ✅ Handle password change flow
      if (password || new_password || confirm_password) {
        // All 3 fields are required
        if (!password || !new_password || !confirm_password) {
          return res
            .status(400)
            .json({ message: "All password fields are required." });
        }

        // Match current password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return res
            .status(400)
            .json({ message: "Current password is incorrect." });
        }

        // Match new and confirm password
        if (new_password !== confirm_password) {
          return res
            .status(400)
            .json({ message: "New and confirm password do not match." });
        }

        // Update password
        // user.password = await bcrypt.hash(new_password, 10);
        user.password = new_password;
      }

      // ✅ Update other fields if provided
      if (name) user.name = name;
      if (mobile) user.mobile = mobile;
      if (image) user.image = image;
      if (passport_number) user.passport_number = passport_number;
      if (spouse_name) user.spouse_name = spouse_name;
      if (pets) user.pets = pets;
      if (dependents) user.dependents = dependents;
      if (ethnicity) user.ethnicity = ethnicity;
      if (address) user.address = address;
      if (zip_code) user.zip_code = zip_code;
      if (sexuality) user.sexuality = sexuality;
      if (legal_guardians_details)
        user.legal_guardians_details = legal_guardians_details;
      if (driver) user.driver = driver;
      if (emergency_contact_number)
        user.emergency_contact_number = emergency_contact_number;
      if (dob) user.dob = dob;
      if (company_branch) user.company_branch = company_branch;
      if (gender) user.gender = gender;
      if (language && Array.isArray(language)) user.language = language;
      if (mother_name) user.mother_name = mother_name;
      if (father_name) user.father_name = father_name;
      if (employment_status) user.employment_status = employment_status;
      if (country) user.country = country;
      if (state) user.state = state;
      if (city) user.city = city;
      if (marital_status) user.marital_status = marital_status;
      if (designation) user.designation = designation;

      const updatedProfile = await user.save();

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
      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      const token = await generateToken(user._id as string);

      // Reset URL
      const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${token}`;

      // Send Email
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // Replace with your SMTP server host
        port: Number(process.env.EMAIL_PORT), // Common port for SMTP (587 for TLS, 465 for SSL)
        secure: false, // True for 465 (SSL), false for other ports
        auth: {
          user: process.env.EMAIL_HOST_USER,
          pass: process.env.EMAIL_HOST_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: process.env.DEFAULT_FROM_EMAIL,
        to: email,
        subject: "Password Reset Request",
        text: `Click this link to reset your password: ${resetUrl}`,
      });

      res.status(200).json({
        message: "Password reset email sent successfully.",
      });
    } catch (error: any) {
      console.log("error", error);
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);

export const verifyResetToken = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body;

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

      // Find user by ID
      const user = await User.findById(decodedToken.userId);
      if (!user) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      const updatedData: Partial<IUser> = {};
      if (password) {
        const hashedPassword = await bcrypt.hash(String(password), 10);
        updatedData.password = hashedPassword; // Update password only if provided
      }

      const updatedUser = await User.findByIdAndUpdate(
        decodedToken.userId,
        updatedData,
        { new: true, runValidators: true } // Ensures the updated data adheres to the schema
      ).select("-password"); // Exclude the password field from the result

      if (!updatedUser) {
        res.status(404).json({ message: `${modelTitle} not found.` });
      }

      res
        .status(200)
        .json({ message: "Password has been reset successfully." });
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
      const user = await User.findById(req.user._id);
      if (!user) {
        res.status(404).json({ message: "User not found." });
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
