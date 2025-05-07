import { Response } from "express";
import moment from "moment";
import { AuthRequest } from "../interfaces/Auth";
import Company from "../models/company/Company";
import CompanyUser from "../models/company/CompanyUser";
import CompanyService from "../models/company/CompanyService";
import Appointment from "../models/appointment/Appointment";
import Prescription from "../models/company/Prescription";

const asyncHandler = require("express-async-handler");

const modelTitle = "Appointments";

// Create a new Company
export const createAppointment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const customer = req?.user?._id;
      const {
        company,
        company_user,
        appointment_type,
        detail,
        date,
        status,
        services,
      } = req.body;

      const companyData = await Company.findById(company);
      if (!companyData) {
        res.status(404).json({ message: "Company not found." });
        return;
      }

      const companyPrefix = company.prefix || "default";

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
      const service = await CompanyService.findOne({
        _id: services,
        company: company,
      });
      if (!service) {
        res
          .status(404)
          .json({
            message: "Service does not belong to the selected company.",
          });
        return;
      }

      const existing = await Appointment.findOne({
        company,
        customer,
        appointment_type,
        company_user,
      });
      if (existing) {
        res.status(400).json({ message: "CompanyID already exists." });
        return;
      }

      const appointmentDate = moment(date).startOf("day").toDate();
      const nextDay = moment(date).startOf("day").add(1, "day").toDate();

      // ✅ Find the last appointment for the same company and day
      const lastAppointment = await Appointment.findOne({
        company,
        date: { $gte: appointmentDate, $lt: nextDay },
      })
        .sort({ uuid: -1 }) // Sort in descending order
        .collation({ locale: "en", numericOrdering: true });

      let newNumber = 1; // Default to 1 if no previous appointment exists for the day

      if (lastAppointment) {
        const lastNumber = parseInt(
          lastAppointment.uuid.split("-").pop() || "0",
          10
        );
        if (!isNaN(lastNumber)) {
          newNumber = lastNumber + 1;
        }
      }

      // ✅ Generate UUID in the format: PREFIX-ap-N
      const appointmentUuid = `${companyPrefix}-AP-${newNumber}`;
      const newData = new Appointment({
        uuid: appointmentUuid,
        company,
        customer,
        company_user,
        appointment_type,
        detail,
        date,
        status,
        services,
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
export const getAllAppointments = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        page = "1",
        limit = "10",
        sortBy = "name",
        order = "asc",
        search = "",
      } = req.query;

      // Get logged-in customer ID
      const customer = req?.user?._id;
      if (!customer) {
        res.status(401).json({ message: "Unauthorized access." });
      }

      // Parse and validate page and limit
      const parsedPage = Math.max(parseInt(page as string, 10), 1);
      const parsedLimit = Math.max(parseInt(limit as string, 10), 1);
      const sortOrder = order === "asc" ? 1 : -1;

      // Create query object
      const query: any = { customer }; // Filter by logged-in customer

      if (search) {
        query.$or = [{ name: { $regex: search, $options: "i" } }];
      }

      if (customer) {
        query.customer = customer;
      }

      // Fetch appointments with pagination
      const data = await Appointment.find(query)
        .lean()
        .populate("company", "name")
        .populate("customer", "name")
        .populate("appointment_type", "name")
        .populate("company_user", "name")
        .populate("services", "service_name")
        .sort({ [sortBy as string]: sortOrder })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);

      // Get total count of filtered appointments
      const totalData = await Appointment.countDocuments(query);

      // Format date
      const formattedData = data.map((prescription: any) => ({
        ...prescription,
        date: prescription.date
          ? moment(prescription.date).format("YYYY-MM-DD hh:mm:ss A")
          : null,
      }));

      // Send response
      res.status(200).json({
        data: formattedData,
        total: totalData,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalData / parsedLimit),
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching appointments.", error });
    }
  }
);

// Get a single Company by ID
export const getAppointment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const data = await Appointment.findById(id)
        .populate("company", "name")
        .populate("customer", "name")
        .populate("appointment_type", "name")
        .populate("company_user", "name")
        .populate("services", "service_name");

      if (!data) {
        res.status(404).json({ message: `${modelTitle} not found.` });
        return;
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: `Error ${modelTitle}.`, error });
    }
  }
);

// Update a Company
export const updateAppointment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const {
        detail,
        company,
        company_user,
        customer,
        appointment_type,
        date,
        services,
      } = req.body;

      const updatedData = await Appointment.findByIdAndUpdate(
        id,
        {
          detail,
          company,
          company_user,
          customer,
          appointment_type,
          date,
          services,
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
export const deleteAppointment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      await Promise.all([
        Prescription.deleteMany({ company: id }), // Remove prescription related to the company
      ]);

      const deletedData = await Appointment.findByIdAndDelete(id);
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
