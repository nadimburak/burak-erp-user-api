import { Request, Response } from "express";
import { AuthRequest } from "../interfaces/Auth";
import CustomerMedicalCover from "../models/CustomerMedicalCover";

const asyncHandler = require("express-async-handler");

const modelTitle = "Customer Medical Cover";

// Create a new Company
export const createCustomerMedicalCover = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const customer = req?.user?._id;
      const { medical_cover_type, details, start_date, end_date, status } =
        req.body;

      // const existing = await CustomerMedicalCover.findOne({ customer, medical_cover_type });
      // if (existing) {
      //     res.status(400).json({ message: "CustomerId already exists." });
      //     return;
      // }

      const newData = new CustomerMedicalCover({
        customer,
        medical_cover_type,
        details,
        start_date,
        end_date,
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
export const getAllCustomerMedicalCovers = asyncHandler(
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
      const data = await CustomerMedicalCover.find(query)
        .populate("customer", "name")
        .populate("medical_cover_type", "name")
        .sort({ [sortBy as string]: sortOrder })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);

      // Count total number of companies
      const totalData = await CustomerMedicalCover.countDocuments(query);

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
export const getCustomerMedicalCoverById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const data = await CustomerMedicalCover.findById(id)
        .populate("customer", "name")
        .populate("medical_cover_type", "name");
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
export const updateCustomerMedicalCover = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { medical_cover_type, details, start_date, end_date } = req.body;

      const updatedData = await CustomerMedicalCover.findByIdAndUpdate(
        id,
        { medical_cover_type, details, start_date, end_date },
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
export const deleteCustomerMedicalCover = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const deletedData = await CustomerMedicalCover.findByIdAndDelete(id);
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
