import { Request, Response } from "express";
import CompanyBranch from "../../models/company/CompanyBranches";

const asyncHandler = require("express-async-handler");

const modelTitle = "CompanyBranch";

export const getAllCompanyBranches = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        page = "1",
        limit = "10",
        sortBy = "name",
        order = "asc",
        search = "",
      } = req.query;

      const parsedPage = Math.max(parseInt(page as string, 10), 1);
      const parsedLimit = Math.max(parseInt(limit as string, 10), 1);
      const sortOrder = order === "asc" ? 1 : -1;

      const query: any = search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } }, // Case-insensitive match for name
            ],
          }
        : {};

      const data = await CompanyBranch.find(query)
        .populate("company", "name")
        .sort({ [sortBy as string]: sortOrder })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);

      const totalData = await CompanyBranch.countDocuments(query);

      res.status(200).json({
        data,
        total: totalData,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalData / parsedLimit),
      });
    } catch (error) {
      res.status(500).json({
        message: `Error fetching ${modelTitle}.`,
        error,
      });
    }
  }
);

export const getCompanyBranchById = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const branch = await CompanyBranch.findById(id).populate(
        "company",
        "name"
      );

      if (!branch) {
        return res.status(404).json({ message: `${modelTitle} not found.` });
      }

      res.status(200).json({ data: branch });
    } catch (error: any) {
      res.status(500).json({ message: `Error fetching ${modelTitle}.`, error });
    }
  }
);
