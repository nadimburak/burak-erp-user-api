import { Response } from "express";
import { AuthRequest } from "../../interfaces/Auth";
import CompanyUser from "../../models/company/CompanyUser";

const asyncHandler = require("express-async-handler");
const modelTitle = "Company User";

export const getAllCompanyUsers = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        page = "1", // Default to page 1 if not provided
        limit = "10", // Default to limit 10 if not provided
        sortBy = "name", // Default sorting field
        order = "asc", // Default order
        search = "", // Default search string
        company = "",
        customer = "",
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

      if (company) {
        query.company = company;
      }

      if (customer) {
        query.customer = customer;
      }

      const data = await CompanyUser.find(query)
        .populate("company", "name")
        .populate("designation", "name")
        .sort({ [sortBy as string]: sortOrder })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);

      // Count total number of company users for the given company
      const totalData = await CompanyUser.find(query).countDocuments();

      // Send the response
      res.status(200).json({
        data,
        total: totalData,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalData / parsedLimit),
      });
    } catch (error) {
      res.status(500).json({ message: `Error creating ${modelTitle}.`, error });
    }
  }
);
