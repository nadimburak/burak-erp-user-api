import { Request, Response } from "express";
import Vaccination from "../models/catalog/Vaccination";

const asyncHandler = require("express-async-handler");
const modelTitle = "Vaccination";

export const getAllVaccinations =  asyncHandler(
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
        const data = await Vaccination.find(query)
            .sort({ [sortBy as string]: sortOrder })
            .skip((parsedPage - 1) * parsedLimit)
            .limit(parsedLimit);

        // Get the total number of documents
        const totalData = await Vaccination.countDocuments(query);

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
})





