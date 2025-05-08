import { Request, Response } from "express";
import Vacancies from "../models/vacancy/vacancies";

const asyncHandler = require("express-async-handler");
const modelTitle = "Vacancies";

export const getAllCustomerVacancies = asyncHandler(
  async (req: Request, res: Response) => {
    try {
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

      // Fetch data with sorting and pagination
      const data = await Vacancies.find(query)
        .populate("company", "name")
        .populate("vacancy_type", "name")
        .populate("country_location", "name")
        .populate("state_location", "name")
        .populate("city_location", "name")
        .sort({ [sortBy as string]: sortOrder })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);

      // Get the total number of documents
      const totalData = await Vacancies.countDocuments(query);

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
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await Vacancies.findById(id)
        .populate("company", "name")
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

// export const updateCustomerVacancyStatus = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const { id } = req.params;
//     // const { vacancy, customer, vacancyStatus } = req.body;

//     const allowedStatuses = ["pending", "approved", "declined"];

//     // if (!allowedStatuses.includes(vacancyStatus)) {
//     //   res.status(400).json({
//     //     message: `Invalid status. Allowed values are: ${allowedStatuses.join(
//     //       ", "
//     //     )}`,
//     //   });
//     //   return;
//     // }
//     const updatedData = await Vacancies.findByIdAndUpdate(
//       id,
//       // { vacancy},
//       { new: true }
//     );

//     if (!updatedData) {
//       res.status(404).json({ message: `${modelTitle} not found.` });
//     }

//     res.status(200).json({
//       data: updatedData,
//       message: `${modelTitle} status updated successfully.`,
//     });
//   } catch (error) {
//     res.status(500).json({ message: `Error ${modelTitle}.`, error });
//   }
// };

// export const createCustomerVacancy = async (req: Request, res: Response) => {
//   try {
//     const { company, vacancy_type, title, location, description, status } =
//       req.body;
//     const newData = new Vacancies({
//       company,
//       vacancy_type,
//       location,
//       description,
//       title,
//       status,
//     });

//     await newData.save();
//     res
//       .status(201)
//       .json({ data: newData, message: `${modelTitle} created successfully.` });
//   } catch (error) {
//     res.status(500).json({ message: `Error ${modelTitle}.`, error });
//   }
// };

// export const updateCustomerVacancy = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { company, vacancy_type, location, description, title, status } =
//       req.body;

//     const updatedData = await Vacancies.findByIdAndUpdate(
//       id,
//       { company, vacancy_type, location, description, title, status },
//       { new: true } // Return the updated document
//     );

//     if (!updatedData) {
//       res.status(404).json({ message: `${modelTitle} not found.` });
//     }

//     res.status(200).json({
//       data: updatedData,
//       message: `${modelTitle} updated successfully.`,
//     });
//   } catch (error) {
//     res.status(500).json({ message: `Error ${modelTitle}.`, error });
//   }
// };

export const deleteCustomerVacancy = asyncHandler(
  async (req: Request, res: Response) => {
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
