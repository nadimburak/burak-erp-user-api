import { Request, Response } from "express";
import moment from "moment";
import path from "path";
import { AuthRequest } from "../interfaces/Auth";
import Prescription from "../models/company/Prescription";
import { ExportPdf } from "../utils/pdf";

const asyncHandler = require("express-async-handler");
const modelTitle = "Prescription";

// Get all Companies
export const getAllPrescriptions = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        page = "1", // Default to page 1 if not provided
        limit = "10", // Default to limit 10 if not provided
        sortBy = "name", // Default sorting field
        order = "asc", // Default order
        search = "", // Default search string
        appointment = "",
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

      if (appointment) {
        query.appointment = appointment;
      }

      // Fetch companies with pagination
      const data = await Prescription.find(query)
        .lean()
        .populate("appointment", "uuid")
        .sort({ [sortBy as string]: sortOrder })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);

      // Get the total number of documents
      const totalData = await Prescription.countDocuments(query);

      const formattedData = data.map((prescription: any) => ({
        ...prescription,
        date: prescription.date
          ? moment(prescription.date).format("YYYY-MM-DD hh:mm:ss A")
          : null,
      }));

      // Send the response
      res.status(200).json({
        data: formattedData,
        total: totalData,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalData / parsedLimit),
      });
    } catch (error) {
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);

export const getPrescriptionsById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const data = await Prescription.findById(id).populate(
        "appointment",
        "uuid"
      );

      if (!data) {
        res.status(404).json({ message: `${modelTitle} not found.` });
      } else {
        const formattedData = {
          ...data.toObject(),
          date: data.date
            ? moment(data.date).format("YYYY-MM-DD hh:mm:ss A")
            : null,
        };

        res.status(200).json({ data: formattedData });
      }
    } catch (error) {
      res.status(500).json({ message: `Error fetching ${modelTitle}.`, error });
    }
  }
);

export const generatePdf = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const data = await Prescription.findById(id)
        .populate("appointment", "uuid")
        .populate("company", "name");

      if (!data) {
        res.status(404).json({ message: "Prescription not found." });
        return;
      }

      // ✅ Prepare Data for PDF
      const pdfData = {
        title: `Prescription`,
        description: `Prescription Details`,
        data: {
          ...data.toObject(),
          products: JSON.stringify(data.products, null, 2),
        },
      };

      console.log("PDF Data:", pdfData);

      const templateFile = path.resolve(
        __dirname,
        "../../views/prescription.ejs"
      );
      console.log(templateFile);
      const filePath = `storage/customer-prescription-${id}.pdf`;

      await ExportPdf(pdfData, templateFile, filePath);

      res.status(200).json({ filePath, message: "PDF generated successfully" });
    } catch (err) {
      console.error("Error generating PDF:", err);
      res.status(500).json({ message: "Failed to generate PDF", error: err });
    }
  }
);
