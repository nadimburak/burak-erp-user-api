import mongoose, { Document, Model, Schema } from "mongoose";
// Interface for Designation Document
export interface ICustomerVacancyApplications extends Document {
  company: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  vacancy: mongoose.Types.ObjectId;
  vacancy_type: mongoose.Types.ObjectId;
  country_location: mongoose.Types.ObjectId;
  state_location: mongoose.Types.ObjectId;
  city_location: mongoose.Types.ObjectId;
  description: string;
  vacancyStatus: "pending" | "applied";
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

// Schema Definition
const CustomerVacancyApplicationsSchema: Schema<ICustomerVacancyApplications> =
  new Schema(
    {
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
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
      vacancy_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VacancyType",
        required: false,
      },
      country_location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CountryLocation",
        required: false,
      },
      state_location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StateLocation",
        required: false,
      },
      city_location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CityLocation",
        required: false,
      },
      vacancyStatus: {
        type: String,
        required: false,
      },
      description: { type: String, required: false },
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
const CustomerVacancyApplication: Model<ICustomerVacancyApplications> =
  mongoose.model<ICustomerVacancyApplications>(
    "CustomerVacancyApplications",
    CustomerVacancyApplicationsSchema
  );

export default CustomerVacancyApplication;
