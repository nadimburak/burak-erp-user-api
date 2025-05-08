import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../interfaces/Auth";
import CustomerVacancyApplication from "../models/vacancy/vacancyRequest";
import Vacancies from "../models/vacancy/vacancies";
const asyncHandler = require("express-async-handler");
const modelTitle = "Customer Vacancy Apply";

export const getAllCustomerVacancies = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const company = req?.user?.company;
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

      if (company) {
        query.company = company;
      }
      // Fetch data with sorting and pagination
      const data = await CustomerVacancyApplication.find(query)
        .lean()
        .populate("company", "name")
        .populate("customer", "name")
        .populate("vacancy", "title")
        .populate("vacancy_type", "name")
        .populate("description", "name")
        .sort({ [sortBy as string]: sortOrder })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);

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

export const getCustomerVacancy = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const data = await CustomerVacancyApplication.findById(id)
        .populate("company", "name")
        .populate("customer", "name")
        .populate("description", "name")
        .populate("vacancy", "title")
        .populate("vacancy_type", "name");
      if (!data) {
        res.status(404).json({ message: `${modelTitle} not found.` });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);

export const createCustomerVacancyApplication = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const customer = req?.user?._id;
      const {
        company,
        vacancy,
        description,
        vacancy_type,
        country_location,
        state_location,
        city_location,
      } = req.body;

      // Check if already applied
      const existingApplication = await CustomerVacancyApplication.findOne({
        customer,
        vacancy,
      });

      if (existingApplication) {
        return res.status(400).json({
          message: "You have already applied for this vacancy.",
        });
      }

      // Create new application
      const newApplication = await CustomerVacancyApplication.create({
        company: new mongoose.Types.ObjectId(company),
        vacancy: new mongoose.Types.ObjectId(vacancy),
        customer: new mongoose.Types.ObjectId(customer),
        country_location: new mongoose.Types.ObjectId(country_location),
        state_location: new mongoose.Types.ObjectId(state_location),
        city_location: new mongoose.Types.ObjectId(city_location),
        description: description,
        vacancy_type: new mongoose.Types.ObjectId(vacancy_type),
        vacancyStatus: "pending",
      });

      // Populate the newly created application
      const populatedApplication = await CustomerVacancyApplication.findById(
        newApplication._id
      )
        .populate("company", "name")
        .populate("vacancy_type", "name")
        .populate("vacancy", "title")
        .populate("customer", "name")
        .populate("country_location", "name")
        .populate("state_location", "name")
        .populate("city_location", "name");
      res.status(201).json({
        data: populatedApplication,
        message: `${modelTitle} created successfully.`,
      });
    } catch (error) {
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);

export const updateCustomerVacancyStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const {
        vacancy,
        customer,
        vacancyStatus,
        description,
        vacancy_type,
        country_location,
        state_location,
        city_location,
      } = req.body;

      const allowedStatuses = ["pending", "applied"];

      if (!allowedStatuses.includes(vacancyStatus)) {
        res.status(400).json({
          message: `Invalid status. Allowed values are: ${allowedStatuses.join(
            ", "
          )}`,
        });
        return;
      }
      const updatedData = await CustomerVacancyApplication.findByIdAndUpdate(
        id,
        {
          vacancy,
          customer,
          description,
          vacancy_type,
          country_location,
          state_location,
          city_location,
        },
        { new: true }
      )
        .populate("company", "name")
        .populate("vacancy_type", "name")
        .populate("vacancy", "title")
        .populate("customer", "name")
        .populate("description", "name")
        .populate("country_location", "name")
        .populate("state_location", "name")
        .populate("city_location", "name");

      if (!updatedData) {
        res.status(404).json({ message: `${modelTitle} not found.` });
      }

      res.status(200).json({
        data: updatedData,
        message: `${modelTitle} status updated successfully.`,
      });
    } catch (error) {
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);

export const deleteCustomerVacancy = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const deletedData = await Vacancies.findByIdAndDelete(id);
      if (!deletedData) {
        res.status(404).json({ message: `${modelTitle} not found.` });
      }

      res.status(200).json({ message: `${modelTitle} deleted successfully.` });
    } catch (error) {
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);
