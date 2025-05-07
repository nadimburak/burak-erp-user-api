import express, { Request, Response } from "express";
import moment from "moment";
import path from "path";
import { AuthRequest } from "../interfaces/Auth";
import CompanyUser from "../models/company/CompanyUser";
import CompanyCustomer from "../models/company/CompanyCustomer";
import Appointment from "../models/appointment/Appointment";
import ReportDocument from "../models/ReportDocument";
import { ExportPdf } from "../utils/pdf";

const asyncHandler = require("express-async-handler");
const router = express.Router();

const modelTitle = "Report Document";

// Create a new Company
export const createReportDocument = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const customer = req?.user?._id;
      const { company, appointment, company_user, details, url, date, status } =
        req.body;

      const companyUser = await CompanyUser.findOne({
        _id: company_user,
        company: company,
      });
      if (!companyUser) {
        res
          .status(404)
          .json({ message: "Company user not found in the selected company." });
      }

      const customerData = await CompanyCustomer.findOne({ customer, company });
      if (!customerData) {
        res
          .status(404)
          .json({
            message: "Customer does not belong to the selected company.",
          });
      }

      const appointmentData = await Appointment.findOne({
        _id: appointment,
        company: company,
      });
      if (!appointmentData) {
        res.status(404).json({
          message: "Appointment does not belong to the selected company.",
        });
        return;
      }

      // Create a new company service
      const newData = new ReportDocument({
        customer,
        company,
        appointment,
        company_user,
        details,
        url,
        date,
        status,
      });

      await newData.save();

      res.status(201).json({
        data: newData,
        message: `${modelTitle} created successfully.`,
      });
    } catch (error: any) {
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);

// Get all Companies
export const getAllReportDocuments = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const customer = req?.user?._id;
      const {
        page = "1", // Default to page 1 if not provided
        limit = "10", // Default to limit 10 if not provided
        sortBy = "name", // Default sorting field
        order = "asc", // Default order
        search = "", // Default search string
        company = "",
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

      if (company) {
        const companyCustomers = await CompanyCustomer.find({
          company,
        }).select("customer");
        const customerIds = companyCustomers.map((cc: any) => cc.customer);
        if (customerIds.length > 0) {
          query.customer = { $in: customerIds };
        }
      }

      if (customer) {
        query.customer = customer;
      }

      // Fetch companies with pagination
      const data = await ReportDocument.find(query)
        .lean()
        .populate("customer", "name")
        .populate("company", "name")
        .populate("company_user", "name")
        .populate("appointment", "uuid")
        .sort({ [sortBy as string]: sortOrder })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);
      // Count total number of companies
      const totalData = await ReportDocument.countDocuments(query);

      const formattedData = data.map((report: any) => ({
        ...report,
        date: report.date ? moment(report.date).format("YYYY-MM-DD") : null,
      }));

      // Send response with companies and pagination info
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

// Get a single Company by ID
export const getReportDocument = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const data = await ReportDocument.findById(id)
        .populate("customer", "name")
        .populate("company", "name")
        .populate("appointment", "uuid")
        .populate("company_user", "name");
      if (!data) {
        res.status(404).json({ message: `${modelTitle} not found.` });
        return;
      }

      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);

// Update a Company
export const updateReportDocument = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const {
        company,
        customer,
        appointment,
        company_user,
        details,
        date,
        url,
      } = req.body;

      const updatedData = await ReportDocument.findByIdAndUpdate(
        id,
        {
          company,
          customer,
          appointment,
          company_user,
          details,
          date,
          url,
        },
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
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);

// Delete a Company
export const deleteReportDocument = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const deletedData = await ReportDocument.findByIdAndDelete(id);
      if (!deletedData) {
        res.status(404).json({ message: `${modelTitle} not found.` });
        return;
      }

      res.status(200).json({ message: `${modelTitle} deleted successfully.` });
    } catch (error) {
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);

export const generatePdf = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const data = await ReportDocument.findById(id)
        .populate("customer", "name")
        .populate("company", "name")
        .populate("company_user", "name")
        .populate("appointment", "uuid");

      console.log(data);

      if (!data) {
        res.status(404).json({
          message: "report document not found.",
        });
        return;
      }

      const pdfData = {
        title: `Report Document`,
        description: `Report Document`,
        data: data,
      };

      const templateFile = path.resolve(
        __dirname,
        "../../views/reportDocument.ejs"
      );
      const filePath = `storage/report-document-${id}.pdf`;
      await ExportPdf(pdfData, templateFile, filePath);

      res.status(200).json({
        filePath: filePath,
        message: "PDF generated successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to generate PDF");
    }
  }
);

export default router;
