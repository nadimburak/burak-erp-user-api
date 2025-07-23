import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICompanyBranch extends Document {
  company: mongoose.Types.ObjectId;
  name: string;
  contact_name?: string;
  email?: string;
  mobile?: string;
  address?: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

const CompanyBranchSchema: Schema<ICompanyBranch> = new Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contact_name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: false,
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
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

const CompanyBranch: Model<ICompanyBranch> = mongoose.model<ICompanyBranch>(
  "CompanyBranch",
  CompanyBranchSchema
);

export default CompanyBranch;
