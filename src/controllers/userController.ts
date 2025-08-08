import bcrypt from "bcrypt";
import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../interfaces/Auth";
import User, { IUser } from "../models/User";

const modelTitle = "User";

//for only user type
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = "1", // Default to page 1 if not provided
      limit = "10", // Default to limit 10 if not provided
      sortBy = "name", // Default sorting field
      order = "asc", // Default order
      search = "",
    } = req.query;

    const { company } = req.headers;
    const { type } = req.user;

    // Parse and validate page and limit
    const parsedPage = Math.max(parseInt(page as string, 10), 1); // Minimum value 1
    const parsedLimit = Math.max(parseInt(limit as string, 10), 1); // Minimum value 1
    const sortOrder = order === "asc" ? 1 : -1; // Convert order to MongoDB format

    const query: any = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } }, // Case-insensitive match for name
            { email: { $regex: search, $options: "i" } }, // Case-insensitive match for email
          ],
        }
      : {};

    // console.log(user, "COMPANY USER");

    // Apply company filter based on user type and header
    if (type !== "super_admin") {
      if (company) {
        query.company = company;
      } else {
        res.status(200).json({
          data: [],
          total: 0,
          currentPage: 1,
          totalPages: 0,
        });
        return;
      }
    } else {
      if (company) {
        query.company = company;
      }
    }

    // If super_admin, don't add company filter – get all users

    // Fetch data with pagination, sorting, and filtering
    const data = await User.find(query)
      .populate("role", "name")
      .populate("company", "name")
      .select("-password")
      .sort({ [sortBy as string]: sortOrder })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    // Count total documents
    const totalData = await User.countDocuments(query);

    // Send the response
    res.status(200).json({
      data,
      total: totalData,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalData / parsedLimit),
    });
    return;
  } catch (error) {
    res.status(500).json({ message: `Error ${modelTitle}.`, error });
  }
};

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const data = await User.findById(id)
      .select("-password")
      .populate("company", "name") // Exclude password
      .populate("role", "name"); // Exclude password
    if (!data) {
      res.status(404).json({ message: `${modelTitle} not found.` });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: `Error  ${modelTitle}.`, error });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { role, name, email, password, status, image, type } = req.body;

    const { company } = req.headers;

    // Check if the user already exists
    const existingData = await User.findOne({ email });
    if (existingData) {
      res.status(400).json({ message: `${modelTitle} already exists.` });
    }

    const newData: IUser = new User({
      company: company, // Use the company from headers
      role,
      name,
      email,
      image,
      password,
      status,
      type: type || "user", // Default type to 'user' if not provided
    });

    if (company) {
      newData.company = [new mongoose.Types.ObjectId(company as string)];
    }
    await newData.save();

    res
      .status(201)
      .json({ data: newData, message: `${modelTitle} created successfully.` });
  } catch (error) {
    res.status(500).json({ message: `Error creating ${modelTitle}.`, error });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, status, image, type } = req.body;
    const { company } = req.headers;

    const updatedData: Partial<IUser> = {
      name,
      email,
      image,
      role,
      status,
      type: type || "user", // Default type to 'user' if not provided
    };

    // Update company if provided in headers
    if (company) {
      updatedData.company = [new mongoose.Types.ObjectId(company as string)]; // Convert to ObjectId
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword; // Update password only if provided
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true } // Ensures the updated data adheres to the schema
    ).select("-password"); // Exclude the password field from the result

    if (!updatedUser) {
      res.status(404).json({ message: `${modelTitle} not found.` });
    }

    res.status(200).json({
      data: updatedData,
      message: `${modelTitle} updated successfully.`,
    });
  } catch (error) {
    res.status(500).json({ message: `Error updating ${modelTitle}.`, error });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      res.status(404).json({ message: `${modelTitle} not found.` });
    }

    res.status(200).json({ message: `${modelTitle} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: `Error deleting ${modelTitle}.`, error });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const updatedData: Partial<IUser> = {};
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData["password"] = hashedPassword; // Update password only if provided
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true } // Ensures the updated data adheres to the schema
    ).select("-password"); // Exclude the password field from the result

    if (!updatedUser) {
      res.status(404).json({ message: `${modelTitle} not found.` });
    }

    res.status(200).json({
      data: updatedData,
      message: `${modelTitle} updated successfully.`,
    });
  } catch (error) {
    res.status(500).json({ message: `Error creating ${modelTitle}.`, error });
  }
};
