import mongoose, { Document, Model, Schema } from "mongoose";

// Interface for Designation Document
export interface IVacancies extends Document {
  company: mongoose.Types.ObjectId;
  vacancy_type: mongoose.Types.ObjectId;
  company_user: mongoose.Types.ObjectId;
  country_location: mongoose.Types.ObjectId;
  state_location: mongoose.Types.ObjectId;
  city_location: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: boolean; // true or false
  created_at: Date;
  updated_at: Date;
}

// Schema Definition
const VacanciesSchema: Schema<IVacancies> = new Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: false,
    },
    vacancy_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VacancyType",
      required: false,
    },
    company_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyUser",
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
    title: {
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
const Vacancies: Model<IVacancies> = mongoose.model<IVacancies>(
  "Vacancy",
  VacanciesSchema
);

export default Vacancies;
