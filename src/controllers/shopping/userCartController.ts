import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../../interfaces/Auth";
import UserCart, { IUserCart } from "../../models/shopping/UserCart";

const modelTitle = "User Cart";

//for only user type
export const getUserCarts = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = "1", // Default to page 1 if not provided
      limit = "10", // Default to limit 10 if not provided
      sortBy = "name", // Default sorting field
      order = "asc", // Default order
      search = "",
    } = req.query;

    const { company } = req.headers;
    const { _id } = req.user;

    // Parse and validate page and limit
    const parsedPage = Math.max(parseInt(page as string, 10), 1); // Minimum value 1
    const parsedLimit = Math.max(parseInt(limit as string, 10), 1); // Minimum value 1
    const sortOrder = order === "asc" ? 1 : -1; // Convert order to MongoDB format

    const query: any = search
      ? {
      }
      : {};

    if (_id) {
      query.user = _id;
    }

    // Fetch data with pagination, sorting, and filtering
    const data = await UserCart.find(query)
      .populate("user", "name")
      .populate("product", "name")
      .sort({ [sortBy as string]: sortOrder })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    // Count total documents
    const totalData = await UserCart.countDocuments(query);

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

export const createUserCart = async (req: AuthRequest, res: Response) => {
  try {
    const { product, quantity } = req.body;
    const { _id } = req.user;

    // Check if the user already has this product in cart
    const existingData = await UserCart.findOne({ user: _id, product });

    if (existingData) {
      // Update quantity if product already exists in cart
      existingData.quantity += quantity;
      await existingData.save();

      res.status(200).json({
        data: existingData,
        message: `${modelTitle} quantity updated successfully.`
      });
    }

    // Create new cart item if it doesn't exist
    const newData: IUserCart = new UserCart({
      product: product,
      quantity: quantity,
      user: new mongoose.Types.ObjectId(_id as string)
    });

    await newData.save();

    res.status(201).json({
      data: newData,
      message: `${modelTitle} created successfully.`
    });
  } catch (error) {
    res.status(500).json({
      message: `Error creating ${modelTitle}.`,
      error
    });
  }
};

export const deleteUserCart = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const deletedData = await UserCart.findByIdAndDelete(id);
    if (!deletedData) {
      res.status(404).json({ message: `${modelTitle} not found.` });
    }

    res.status(200).json({ message: `${modelTitle} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: `Error deleting ${modelTitle}.`, error });
  }
};