import { Request, Response } from "express";
import CompanyService from "../../models/company/CompanyService";

const asyncHandler = require("express-async-handler");

const modelTitle = "Company Service";

// Get all Companies
export const getAllCompanyService = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        page = "1", // Default to page 1 if not provided
        limit = "10", // Default to limit 10 if not provided
        sortBy = "service_details.name", // Default sorting field
        order = "asc", // Default order
        search = "", // Default search string
        company = "",
      } = req.query;

      // Parse and validate page and limit
      const parsedPage = Math.max(parseInt(page as string, 10), 1); // Minimum value 1
      const parsedLimit = Math.max(parseInt(limit as string, 10), 1); // Minimum value 1
      const sortOrder = order === "asc" ? 1 : -1; // Convert order to MongoDB format

      const query: any = search
        ? {
            $or: [
              { cost_usd: { $regex: search, $options: "i" } }, // Case-insensitive match for name
            ],
          }
        : {};

      if (company) {
        query.company = company;
      }

      // Fetch companies with pagination
      const data = await CompanyService.find(query)
        .populate("company", "name")
        .sort({ [sortBy as string]: sortOrder })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);

      // Get the total number of documents
      const totalData = await CompanyService.countDocuments(query);

      // Send the response
      res.status(200).json({
        data,
        total: totalData,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalData / parsedLimit),
      });
    } catch (error: any) {
      console.log("error", error);
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);
