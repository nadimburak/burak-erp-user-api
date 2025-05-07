import { Request, Response } from "express";
import { AuthRequest } from "../interfaces/Auth";
import CustomerBank from "../models/CustomerBank";

const asyncHandler = require("express-async-handler");
const modelTitle = "Customer Bank";

// Create a new Company
export const createCustomerBank = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const customer = req?.user?._id;
      const { bank_name, account_number, bank_code, status } = req.body;

      // const existing = await CustomerBank.findOne({ customer });
      // if (existing) {
      //     res.status(400).json({ message: "CustomerId already exists." });
      // }

      const newData = new CustomerBank({
        customer,
        bank_name,
        account_number,
        bank_code,
        status,
      });
      await newData.save();

      res.status(201).json({
        data: newData,
        message: `${modelTitle} created successfully.`,
      });
    } catch (error) {
      res.status(500).json({
        message: `Error creating ${modelTitle}.`,
        error: "An unexpected error occurred.",
      });
    }
  }
);

// Get all Companies
export const getAllCustomerBank = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const customer = req?.user?._id;

      const {
        page = "1", // Default to page 1 if not provided
        limit = "10", // Default to limit 10 if not provided
        sortBy = "name", // Default sorting field
        order = "asc", // Default order
        search = "", // Default search string
        company = "", // Default search string
      } = req.query;

      // Extract page and limit from query parameters, with default values
      const parsedPage = Math.max(parseInt(page as string, 10), 1); // Minimum value 1
      const parsedLimit = Math.max(parseInt(limit as string, 10), 1); // Minimum value 1
      const sortOrder = order === "asc" ? 1 : -1; // Convert order to MongoDB format

      const query: any = search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } }, // Case-insensitive match for name
            ],
          }
        : {};

      if (customer) {
        query.customer = customer;
      }

      // Fetch companies with pagination
      const data = await CustomerBank.find(query)
        .populate("customer", "name")
        .sort({ [sortBy as string]: sortOrder })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);

      // Count total number of companies
      const totalData = await CustomerBank.countDocuments(query);

      // Send the response
      res.status(200).json({
        data,
        total: totalData,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalData / parsedLimit),
      });
    } catch (error) {
      res.status(500).json({
        message: `Error fetching ${modelTitle}.`,
        error: "An unexpected error occurred.",
      });
    }
  }
);

// Get a single Company by ID
export const getCustomerBankById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const customer_bank = await CustomerBank.findById(id).populate(
        "customer",
        "name"
      );
      if (!customer_bank) {
        res.status(404).json({ message: `${modelTitle} not found.` });
        return;
      }

      res.status(200).json({ customer_bank });
    } catch (error) {
      res.status(500).json({
        message: `Error fetching ${modelTitle}.`,
        error: "An unexpected error occurred.",
      });
    }
  }
);

// Update a Company
export const updateCustomerBank = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { bank_name, account_number, bank_code, status } = req.body;

      const updatedData = await CustomerBank.findByIdAndUpdate(
        id,
        { bank_name, account_number, bank_code, status },
        { new: true } // Return the updated document
      );

      if (!updatedData) {
        res.status(404).json({ message: `${modelTitle} not found.` });
        return;
      }

      res.status(200).json({
        data: updatedData,
        message: `${modelTitle} updated successfully.`,
      });
    } catch (error) {
      res.status(500).json({
        message: `Error updating ${modelTitle}.`,
        error: "An unexpected error occurred.",
      });
    }
  }
);

// Delete a Company
export const deleteCustomerBank = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const deletedData = await CustomerBank.findByIdAndDelete(id);
      if (!deletedData) {
        res.status(404).json({ message: `${modelTitle} not found.` });
        return;
      }

      res.status(200).json({ message: `${modelTitle} deleted successfully.` });
    } catch (error) {
      res.status(500).json({
        message: `Error deleting ${modelTitle}.`,
        error: "An unexpected error occurred.",
      });
    }
  }
);
