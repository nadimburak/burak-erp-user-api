import mongoose, { Schema, Document, Model } from "mongoose";

import Customer from "../customer/Customer";
// Interface for Designation Document
export interface IVacancyApplications extends Document {
  company: mongoose.Types.ObjectId;
  company_user: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  vacancy: mongoose.Types.ObjectId;
  vacancyStatus: "pending" | "approved" | "declined";
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

// Schema Definition
const VacancyApplicationsSchema: Schema<IVacancyApplications> = new Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: false,
    },
    company_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyUser",
      required: false,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },
    vacancy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vacancy",
      required: false,
    },
    vacancyStatus: {
      type: String,
      required: false,
    },
    status: {
      type: Boolean,
      required: false,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, // Mongoose will manage timestamps
  }
);

// Model Definition
const VacancyApplications: Model<IVacancyApplications> =
  mongoose.model<IVacancyApplications>(
    "VacancyApplications",
    VacancyApplicationsSchema
  );

export default VacancyApplications;
