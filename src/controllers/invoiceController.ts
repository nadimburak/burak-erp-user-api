import { Request, Response } from "express";

import moment from "moment";

import path from "path";
import { AuthRequest } from "../interfaces/Auth";
import CompanyUser from "../models/company/CompanyUser";
import CompanyCustomer from "../models/company/CompanyCustomer";
import Appointment from "../models/appointment/Appointment";
import Invoice from "../models/company/Invoice";
import { ExportPdf } from "../utils/pdf";

const asyncHandler = require("express-async-handler");
const modelTitle = "Invoice";

// Create a new Company
export const createInvoice = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const customer = req?.user?._id;

      const {
        company,
        appointment,
        company_user,
        detail,
        date,
        total_amount,
        total_tax,
        total_discount,
        status,
      } = req.body;

      const companyUser = await CompanyUser.findOne({
        _id: company_user,
        company: company,
      });
      if (!companyUser) {
        res
          .status(404)
          .json({ message: "Company user not found in the selected company." });
        return;
      }

      const customerData = await CompanyCustomer.findOne({
        customer: customer,
        company: company,
      });
      if (!customerData) {
        res
          .status(404)
          .json({
            message: "Customer does not belong to the selected company.",
          });
        return;
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

      const existingData = await Invoice.findOne({
        appointment,
      });

      if (existingData) {
        res.status(400).json({
          message: `appointment UUID already exists for this invoice.`,
        });
        return;
      }

      const newData = new Invoice({
        customer,
        company,
        appointment,
        company_user,
        detail,
        date,
        total_amount,
        total_tax,
        total_discount,
        status,
      });
      await newData.save();

      res.status(201).json({
        data: newData,
        message: `${modelTitle} created successfully.`,
      });
    } catch (error) {
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);

// Get all Companies
export const getAllInvoices = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const customer = req?.user?._id;
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
      const data = await Invoice.find(query)
        .lean()
        .populate("customer", "name")
        .populate("company", "name")
        .populate("company_user", "name")
        .populate("appointment", "uuid")
        .sort({ [sortBy as string]: sortOrder })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);

      // Get the total number of documents
      const totalData = await Invoice.countDocuments(query);

      const formattedData = data.map((invoice: any) => ({
        ...invoice,
        date: invoice.date ? moment(invoice.date).format("YYYY-MM-DD") : null,
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

// Get a single Company by ID
export const getInvoice = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const data = await Invoice.findById(id)
        .populate("customer", "name")
        .populate("company", "name")
        .populate("company_user", "name")
        .populate("appointment", "uuid");
      if (!data) {
        res.status(404).json({ message: `${modelTitle} not found.` });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);

// Update a Company
export const updateInvoice = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const {
        customer,
        appointment,
        company_user,
        detail,
        date,
        total_amount,
        total_tax,
        total_discount,
        status,
      } = req.body;

      const updatedData = await Invoice.findByIdAndUpdate(
        id,
        {
          customer,
          appointment,
          company_user,
          detail,
          date,
          total_amount,
          total_tax,
          total_discount,
          status,
        },
        { new: true } // Return the updated document
      );

      if (!updatedData) {
        res.status(404).json({ message: `${modelTitle} not found.` });
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
export const deleteInvoice = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const deletedData = await Invoice.findByIdAndDelete(id);

      if (!deletedData) {
        res.status(404).json({ message: `${modelTitle} not found.` });
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

      // Fetch invoice with all necessary relations
      const data = await Invoice.findById(id)
        .populate("customer", "name")
        .populate("company", "name address")
        .populate("company_user", "name email")
        .populate("appointment", "uuid");

      if (!data) {
        res.status(404).json({ message: "Invoice not found." });
        return;
      }

      // Prepare data for the PDF template
      const pdfData = {
        title: `Customer Invoice`,
        description: `Invoice Details`,
        data: data,
      };

      // Define EJS template path
      const templateFile = path.resolve(__dirname, "../../views/invoice.ejs");
      const filePath = `storage/customer-invoice-${id}.pdf`;

      // Generate PDF
      await ExportPdf(pdfData, templateFile, filePath);

      // Respond with PDF path
      res
        .status(200)
        .json({
          filePath,
          message: "Customer Invoice PDF generated successfully",
        });
    } catch (err) {
      console.error("Error generating customer invoice PDF:", err);
      res.status(500).json({ message: "Failed to generate PDF", error: err });
    }
  }
);
