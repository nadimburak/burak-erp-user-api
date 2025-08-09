import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICompanyUser extends Document {
  company?: mongoose.Types.ObjectId;
  customer_user: mongoose.Types.ObjectId;
  uuid?: string; // Optional field
  company_branch: mongoose.Types.ObjectId;
  designation?: mongoose.Types.ObjectId;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

const CompanyUserSchema: Schema<ICompanyUser> = new Schema(
  {
    customer_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: false,
    },
    uuid: {
      type: String,
      required: false,
    },
    company_branch: {
      type: Schema.Types.ObjectId,
      ref: "CompanyBranch",
      required: false,
    },
    designation: {
      type: Schema.Types.ObjectId,
      ref: "Designation",
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
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const CompanyUser: Model<ICompanyUser> =
  mongoose.model<ICompanyUser>("CompanyUser", CompanyUserSchema);

export default CompanyUser;
