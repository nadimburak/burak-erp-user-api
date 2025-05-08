import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

// Interface for Designation Document
export interface ICompanyUser extends Document {
  company: mongoose.Types.ObjectId;
  designation: mongoose.Types.ObjectId;
  language: mongoose.Types.ObjectId;
  gender: mongoose.Types.ObjectId;
  marital_status: mongoose.Types.ObjectId;
  employment_status: mongoose.Types.ObjectId;
  country_location: mongoose.Types.ObjectId;
  state_location: mongoose.Types.ObjectId;
  city_location: mongoose.Types.ObjectId;
  company_role: mongoose.Types.ObjectId;
  pin_code: string;
  address: string;
  passport_number: string;
  ethnicity: string;
  sexuality: string;
  driver: string;
  name: string;
  email: string;
  mobile: string;
  dob: Date;
  isAdmin: boolean;
  password: string;
  pets: string;
  emergency_contact_number: string;
  dependents: string;
  spouses_name: string;
  for_children_under_18: boolean;
  father_name: string;
  mother_name: string;
  legal_guardians_details: string;
  address_type?: "permanent" | "current" | "office" | "other"; // 👈 Enum-like string values
  status: boolean;
  comparePassword(password: string): Promise<boolean>;
  created_at: Date;
  updated_at: Date;
}

// Schema Definition
const CompanyUserSchema: Schema<ICompanyUser> = new Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: false,
    },
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
      required: false,
    },
    company_role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyRole",
      required: false,
    },
    language: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Language",
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
    pin_code: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    ethnicity: {
      type: String,
      required: false,
    },
    sexuality: {
      type: String,
      required: false,
    },
    driver: {
      type: String,
      required: false,
    },
    emergency_contact_number: {
      type: String,
      required: false,
    },
    passport_number: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: false,
    },
    pets: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    dependents: {
      type: String,
      required: false,
    },
    spouses_name: {
      type: String,
      required: false,
    },
    mobile: {
      type: String,
      required: false,
    },
    gender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gender",
      required: false,
    },
    marital_status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaritalStatus",
      required: false,
    },
    employment_status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmploymentStatus",
      required: false,
    },
    isAdmin: {
      type: Boolean,
      required: false,
    },
    for_children_under_18: {
      type: Boolean,
      required: false,
    },
    father_name: {
      type: String,
      required: false,
    },
    mother_name: {
      type: String,
      required: false,
    },
    legal_guardians_details: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    address_type: {
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

CompanyUserSchema.pre<ICompanyUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

CompanyUserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Model Definition
const CompanyUser: Model<ICompanyUser> = mongoose.model<ICompanyUser>(
  "CompanyUser",
  CompanyUserSchema
);

export default CompanyUser;
