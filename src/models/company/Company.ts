import mongoose, { Document, Model, Schema } from "mongoose";
import Industry from "../catalog/Industry";

export interface ICompany extends Document {
  company_type?: mongoose.Types.ObjectId; // reference to company_types._id
  industries: mongoose.Types.ObjectId[]; // array of industry ObjectIds
  owners: mongoose.Types.ObjectId[]; // array of industry ObjectIds
  prefix: string;
  name: string;
  company_logo?: string; // optional as per table
  contact_name?: string;
  email?: string;
  mobile?: string;
  address?: string;
  country?: mongoose.Types.ObjectId;
  state?: mongoose.Types.ObjectId;
  city?: mongoose.Types.ObjectId;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

const CompanySchema: Schema<ICompany> = new Schema(
  {
    company_type: {
      type: Schema.Types.ObjectId,
      ref: "CompanyType",
      required: true,
    },
    industries: [
      {
        type: Schema.Types.ObjectId,
        ref: Industry,
        required: false,
      },
    ],
    owners: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: false,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: false,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: false,
    },
    prefix: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    company_logo: {
      type: String,
      required: false,
    },
    contact_name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    status: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Company: Model<ICompany> = mongoose.model<ICompany>(
  "Company",
  CompanySchema
);

export default Company;
