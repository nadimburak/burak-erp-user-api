import { Response } from "express";
import { AuthRequest } from "../interfaces/Auth";
import CustomerVacancyApplication from "../models/vacancy/vacancyRequest";

const asyncHandler = require("express-async-handler");

const modelTitle = "CustomerVacancyApplications";

export const getAllCustomerStatusVacancies = asyncHandler(
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
      // Fetch data with sorting and pagination
      const data = await CustomerVacancyApplication.find(query)
        .lean()
        .populate("company", "name")
        .populate("customer", "name")
        .populate("vacancy", "title")
        .populate("vacancy_type", "name")
        .populate("description", "name")
        .populate("country_location", "name")
        .populate("state_location", "name")
        .populate("city_location", "name")
        .sort({ [sortBy as string]: sortOrder })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);
      console.log(data, "data");
      // Get the total number of documents
      const totalData = await CustomerVacancyApplication.countDocuments(query);

      // Send the response
      res.status(200).json({
        data,
        total: totalData,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalData / parsedLimit),
      });
    } catch (error) {
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);

export const getCustomerStatusVacancy = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const data = await CustomerVacancyApplication.findById(id)
        .populate("company", "name")
        .populate("customer", "name")
        .populate("description", "name")
        .populate("vacancy", "title")
        .populate("vacancy_type", "name")
        .populate("country_location", "name")
        .populate("state_location", "name")
        .populate("city_location", "name");

      if (!data) {
        res.status(404).json({ message: `${modelTitle} not found.` });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);

export const updateCompanyVacancyStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const company = req?.user?.company;

      const { id } = req.params;
      const {
        status,
        vacancyStatus,
        description,
        country_location,
        state_location,
        city_location,
      } = req.body;

      const allowedStatuses = ["pending", "approved"];
      if (!allowedStatuses.includes(vacancyStatus)) {
        res.status(400).json({
          message: `Invalid status. Allowed values are: ${allowedStatuses.join(
            ", "
          )}`,
        });
        return;
      }
      const vacancyRequest = await CustomerVacancyApplication.findByIdAndUpdate(
        id,
        {
          status,
          vacancyStatus,
          company,
          description,
          country_location,
          state_location,
          city_location,
        },
        { new: true }
      );

      if (!vacancyRequest) {
        res.status(404).json({ message: `${modelTitle} not found.` });
      }

      res.status(200).json({
        data: vacancyRequest,
        message: `${modelTitle} status updated successfully.`,
      });
    } catch (error) {
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);

export const deleteCustomerStatusVacancy = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const deletedData =
        await CustomerVacancyApplication.findByIdAndDelete(id);
      if (!deletedData) {
        res.status(404).json({ message: `${modelTitle} not found.` });
      }

      res.status(200).json({ message: `${modelTitle} deleted successfully.` });
    } catch (error) {
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);
