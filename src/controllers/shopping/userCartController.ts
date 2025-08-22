import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../../interfaces/Auth";
import UserCart, { IUserCart } from "../../models/shopping/UserCart";

const modelTitle = "User Cart";

export const getUserCarts = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      sortBy = "createdAt", // Changed default to something more relevant for carts
      order = "desc", // Changed default to show newest first
      search = "",
    } = req.query;

    const { _id } = req.user;

    // Parse and validate page and limit
    const parsedPage = Math.max(parseInt(page as string, 10), 1);
    const parsedLimit = Math.max(parseInt(limit as string, 10), 1);
    const sortOrder = order === "asc" ? 1 : -1;

    // Build the query - only show carts for the authenticated user
    const query: any = {
      user: new mongoose.Types.ObjectId(_id as string),
    };

    // Add search functionality if needed (search by product name)
    if (search) {
      query.$or = [{ "product.name": { $regex: search, $options: "i" } }];
    }

    // Fetch data with pagination, sorting, and filtering
    const data = await UserCart.find(query)
      .populate("user", "name email") // Added email for more user info
      .populate({
        path: "product",
        select: "name price image", // Added more product fields
        match: search ? { name: { $regex: search, $options: "i" } } : {},
      })
      .sort({ [sortBy as string]: sortOrder })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    // Filter out documents where product doesn't match search (if search is used)
    const filteredData = search
      ? data.filter((item) => item.product !== null)
      : data;

    // Count total documents that match the query
    const totalData = await UserCart.countDocuments(query);
    // Calculate total quantity
    const total_quantity = filteredData.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    res.status(200).json({
      data: filteredData,
      total: totalData,
      total_quantity: total_quantity,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalData / parsedLimit),
      hasNext: parsedPage < Math.ceil(totalData / parsedLimit),
      hasPrev: parsedPage > 1,
    });
  } catch (error) {
    res.status(500).json({ message: `Error fetching ${modelTitle}.`, error });
  }
};

export const createUserCart = async (req: AuthRequest, res: Response) => {
  try {
    const { product, quantity, action } = req.body; // 👈 action bhi bhejna hoga (add, increment, decrement, set)
    const { _id } = req.user;

    const existingData = await UserCart.findOne({ user: _id, product });

    if (existingData) {
      if (action === "increment") {
        existingData.quantity += 1;
      } else if (action === "decrement") {
        existingData.quantity = Math.max(1, existingData.quantity - 1); // 0 se niche na jaye
      } else if (action === "set") {
        existingData.quantity = quantity;
      } else {
        existingData.quantity += quantity; // default add
      }

      await existingData.save();
      res.status(200).json({
        data: existingData,
        message: `${modelTitle} updated successfully.`,
      });
      return;
    } else {
      // Agar cart me pehle se nahi hai to new entry banayenge
      const newData: IUserCart = new UserCart({
        product,
        quantity,
        user: new mongoose.Types.ObjectId(_id as string),
      });

      await newData.save();
      res.status(201).json({
        data: newData,
        message: `${modelTitle} created successfully.`,
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      message: `Error creating ${modelTitle}.`,
      error,
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

export const clearUserCart = async (req: AuthRequest, res: Response) => {
  try {
    const { _id } = req.user;

    const deletedData = await UserCart.findOneAndDelete({ user: _id });
    if (!deletedData) {
      res.status(404).json({ message: `${modelTitle} not found.` });
    }

    res.status(200).json({ message: `${modelTitle} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: `Error deleting ${modelTitle}.`, error });
  }
};
