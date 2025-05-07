import { Request, Response } from "express";
import { AuthRequest } from "../interfaces/Auth";
import CustomerAllergy from "../models/CustomerAllergy";

const asyncHandler = require("express-async-handler");
const modelTitle = "Customer Allergy";

export const getAllCustomerAllergy = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const customer = req?.user?._id;
      const {
        page = "1", // Default to page 1 if not provided
        limit = "10", // Default to limit 10 if not provided
        sortBy = "name", // Default sorting field
        order = "asc", // Default order
        search = "", // Default search string
      } = req.query;

      // Parse and validate page and limit
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
      const data = await CustomerAllergy.find(query)
        .populate("customer", "name")
        .populate("allergy", "name")
        .sort({ [sortBy as string]: sortOrder })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);
      // Count total number of companies
      const totalData = await CustomerAllergy.countDocuments(query);

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
export const getCustomerAllergyById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const data = await CustomerAllergy.findById(id)
        .populate("customer", "name")
        .populate("allergy", "name");
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
// Create a new Company
export const createCustomerAllergy = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const customer = req?.user?._id;
      const { allergy, details, status } = req.body;

      // Check if the service already exists for the company
      const existingService = await CustomerAllergy.findOne({
        customer,
        allergy,
      });

      if (existingService) {
        res
          .status(400)
          .json({ message: "Allergy ID already exists for this customer." });
        return;
      }

      // Create a new company service
      const newData = new CustomerAllergy({
        customer,
        allergy,
        details,
        status,
      });

      await newData.save();

      res.status(201).json({
        data: newData,
        message: `${modelTitle} created successfully.`,
      });
    } catch (error: any) {
      console.error(`Error creating ${modelTitle}:`, error);
      res.status(500).json({
        message: `Error creating ${modelTitle}.`,
        error: error.message || "An unexpected error occurred.",
      });
    }
  }
);

// Get all Companies

// Update a Company
export const updateCustomerAllergy = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { allergy, details } = req.body;

      const updatedData = await CustomerAllergy.findByIdAndUpdate(
        id,
        { allergy, details },
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
export const deleteCustomerAllergy = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const deletedData = await CustomerAllergy.findByIdAndDelete(id);
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
