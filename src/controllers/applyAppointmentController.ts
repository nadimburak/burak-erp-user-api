import { Response } from "express";
import moment from "moment";
import { AuthRequest } from "../interfaces/Auth";
import CompanyUser from "../models/company/CompanyUser";
import CompanyCustomer from "../models/company/CompanyCustomer";
import CompanyService from "../models/company/CompanyService";
import AppointmentRequest from "../models/appointment/AppointmentRequest";
import Prescription from "../models/company/Prescription";

const asyncHandler = require("express-async-handler");
const modelTitle = "ApplyAppointment";

// Create a new Appointment

export const createCustomerApplyAppointment = asyncHandler(
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

      // ✅ Convert frontend date format to expected format
      const appointmentDate = moment(date, moment.ISO_8601, true);
      if (!appointmentDate.isValid()) {
        res.status(400).json({
          message: "Invalid date format. Use 'YYYY-MM-DD hh:mm:ss A' format.",
        });
        return;
      }

      const formattedDate = appointmentDate.format("YYYY-MM-DD hh:mm:ss A");

      const companyPrefix = company.prefix || "DEFAULT";

      const companyUser = await CompanyUser.findOne({
        _id: company_user,
        company,
      });
      if (!companyUser) {
        res
          .status(404)
          .json({ message: "Company user not found in the selected company." });
        return;
      }

      const customerData = await CompanyCustomer.findOne({ customer, company });
      if (!customerData) {
        res
          .status(404)
          .json({
            message: "Customer does not belong to the selected company.",
          });
        return;
      }

      const service = await CompanyService.findOne({ _id: services, company });
      if (!service) {
        res
          .status(404)
          .json({
            message: "Service does not belong to the selected company.",
          });
        return;
      }

      // ✅ Get the highest UUID number from all appointments (regardless of date or customer)
      const lastAppointment = await AppointmentRequest.findOne({ company })
        .sort({ uuid: -1 }) // Get the highest UUID
        .collation({ locale: "en", numericOrdering: true });

      let newNumber = 1; // Default if no previous appointment exists

      if (lastAppointment) {
        const lastUuidParts = lastAppointment.uuid.split("-");
        const lastNumber = parseInt(
          lastUuidParts[lastUuidParts.length - 1] || "0",
          10
        );
        if (!isNaN(lastNumber)) {
          newNumber = lastNumber + 1;
        }
      }

      // ✅ Generate UUID in the format: PREFIX-AP-1, PREFIX-AP-2, ...
      const appointmentUuid = `${companyPrefix}-AP-${newNumber}`;

      // ✅ Create new appointment
      const newData = new AppointmentRequest({
        uuid: appointmentUuid,
        company,
        customer,
        company_user,
        appointment_type,
        detail,
        date: appointmentDate.toDate(),
        status,
        services,
        appointmentStatus: "pending",
      });

      await newData.save();

      res.status(201).json({
        data: {
          ...newData.toObject(),
          date: formattedDate,
        },
        message: `Appointment Request created successfully.`,
      });
    } catch (error: any) {
      res.status(500).json({ message: `Error creating appointment.`, error });
    }
  }
);

// Get all Companies
export const getAllCustomerApplyAppointment = asyncHandler(
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

      // Parse and validate page and limit
      const parsedPage = Math.max(parseInt(page as string, 10), 1); // Minimum value 1
      const parsedLimit = Math.max(parseInt(limit as string, 10), 1); // Minimum value 1
      const sortOrder = order === "asc" ? 1 : -1; // Convert order to MongoDB format

      const query: any = search
        ? {
            $or: [
              { uuid: { $regex: search, $options: "i" } }, // Case-insensitive match for name
            ],
          }
        : {};

      if (company) {
        query.company = company;
      }

      if (customer) {
        query.customer = customer;
      }

      // Fetch companies with pagination
      const data = await AppointmentRequest.find(query)
        .lean()
        .populate("company", "name")
        .populate("customer", "name")
        .populate("appointment_type", "name")
        .populate("company_user", "name")
        .populate("services", ["service_name", "cost_usd"])
        .sort({ [sortBy as string]: sortOrder })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);

      // Get the total number of documents
      const totalData = await AppointmentRequest.countDocuments(query);

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

// Get a single Company by ID
export const getCustomerApplyAppointment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // try {
    const { id } = req.params;

    const data = await AppointmentRequest.findById(id)
      .populate("services", ["service_name", "cost_usd"])
      .populate("company", "name")
      .populate("customer", "name")
      .populate("appointment_type", "name")
      .populate("company_user", "name");

    if (!data) {
      res.status(404).json({ message: `${modelTitle} not found.` });
      return;
    }

    res.status(200).json(data);
    // } catch (error) {
    //     res.status(500).json({ message: `Error ${modelTitle}.`, error });
    // }
  }
);

// Update a Company
export const updateCustomerApplyAppointment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const {
        detail,
        company,
        company_user,
        customer,
        appointment_type,
        services,
        date,
      } = req.body;

      const updatedData = await AppointmentRequest.findByIdAndUpdate(
        id,
        {
          detail,
          company,
          company_user,
          customer,
          appointment_type,
          services,
          date,
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
export const deleteCustomerApplyAppointment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      await Promise.all([
        Prescription.deleteMany({ company: id }), // Remove prescription related to the company
      ]);

      const deletedData = await AppointmentRequest.findByIdAndDelete(id);
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
