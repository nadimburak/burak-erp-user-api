import { Request, Response } from "express";
import { AuthRequest } from "../interfaces/Auth";
import CustomerVaccination from "../models/CustomerVaccination";

const asyncHandler = require("express-async-handler");
const modelTitle = "Customer Vaccination";

// Create a new Company
export const createCustomerVaccination = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const customer = req?.user?._id;
      const { vaccination, details, status } = req.body;

      // Check if the service already exists for the company
      const existingService = await CustomerVaccination.findOne({
        customer,
        vaccination,
      });

      // if (existingService) {
      //     res.status(400).json({ message: "Allergy ID already exists for this customer." });
      //     return;
      // }

      // Create a new company service
      const newData = new CustomerVaccination({
        customer,
        vaccination,
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
export const getAllCustomerVaccinations = asyncHandler(
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
      const data = await CustomerVaccination.find(query)
        .populate("customer", "name")
        .populate("vaccination", "name")
        .sort({ [sortBy as string]: sortOrder })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);

      // Count total number of companies
      const totalData = await CustomerVaccination.countDocuments(query);

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
export const getCustomerVaccinationById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const customer_vaccination = await CustomerVaccination.findById(id)
        .populate("customer", "name")
        .populate("vaccination", "name");
      if (!customer_vaccination) {
        res.status(404).json({ message: `${modelTitle} not found.` });
        return;
      }

      res.status(200).json({ customer_vaccination });
    } catch (error) {
      res.status(500).json({
        message: `Error fetching ${modelTitle}.`,
        error: "An unexpected error occurred.",
      });
    }
  }
);

// Update a Company
export const updateCustomerVaccination = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { vaccination, details } = req.body;

      const updatedData = await CustomerVaccination.findByIdAndUpdate(
        id,
        { vaccination, details },
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
export const deleteCustomerVaccination = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const deletedData = await CustomerVaccination.findByIdAndDelete(id);
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
