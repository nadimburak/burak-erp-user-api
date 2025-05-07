import { Request, Response } from "express";
import { AuthRequest } from "../interfaces/Auth";
import CustomerMedicalCondition from "../models/CustomerMedicalCondition";

const asyncHandler = require("express-async-handler");

const modelTitle = "Customer Medical Condition";

// Create a new Company
export const createCustomerMedicalCondition = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const customer = req?.user?._id;
      const { medical_condition, details, status } = req.body;

      // const existing = await CustomerMedicalCondition.findOne({ customer });
      // if (existing) {
      //     res.status(400).json({ message: "CustomerId already exists." });
      //     return;
      // }

      const newData = new CustomerMedicalCondition({
        customer,
        medical_condition,
        details,
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
export const getAllCustomerMedicalCondition = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const customer = req?.user?._id;
      // Extract page and limit from query parameters, with default values
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
      const data = await CustomerMedicalCondition.find(query)
        .populate("customer", "name")
        .populate("medical_condition", "name")
        .sort({ [sortBy as string]: sortOrder })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);

      // Count total number of companies
      const totalData = await CustomerMedicalCondition.countDocuments(query);

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
export const getCustomerMedicalConditionById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const data = await CustomerMedicalCondition.findById(id)
        .populate("customer", "name")
        .populate("medical_condition", "name");
      if (!data) {
        res.status(404).json({ message: `${modelTitle} not found.` });
        return;
      }

      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({
        message: `Error fetching ${modelTitle}.`,
        error: "An unexpected error occurred.",
      });
    }
  }
);

// Update a Company
export const updateCustomerMedicalCondition = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { medical_condition, details } = req.body;

      const updatedData = await CustomerMedicalCondition.findByIdAndUpdate(
        id,
        { medical_condition, details },
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
export const deleteCustomerMedicalCondition = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const deletedData = await CustomerMedicalCondition.findByIdAndDelete(id);
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
