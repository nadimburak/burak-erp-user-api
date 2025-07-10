import bcrypt from "bcrypt";
import mongoose, { Document, Model, Schema } from "mongoose";
import Company from "./company/Company";
import Role from "./Role";

export type UserType = "user" | "company_user" | "customer";

export interface IUser extends Document {
  company: mongoose.Types.ObjectId;
  role: mongoose.Types.ObjectId;
  name: string;
  mobile?: number;
  image?: string;
  dependents?: number;
  emergency_contact_number?: number;
  email: string;
  password: string;
  passport_number?: string;
  dob: Date;
  spouse_name?: string;
  father_name?: string;
  mother_name?: string;
  status: boolean;
  type: UserType;
  legal_guardians_details?: string;
  ethnicity?: string;
  sexuality?: string;
  driver?: string;
  pets?: string;
  designation?: mongoose.Types.ObjectId;
  marital_status?: mongoose.Types.ObjectId;
  country?: mongoose.Types.ObjectId;
  state?: mongoose.Types.ObjectId;
  city?: mongoose.Types.ObjectId;
  address?: string;
  zip_code?: number;
  employment_status?: mongoose.Types.ObjectId;
  gender?: mongoose.Types.ObjectId;
  company_branch?: mongoose.Types.ObjectId;
  language?: mongoose.Types.ObjectId[];
  comparePassword(password: string): Promise<boolean>;
  toProfileJSON(options?: { includeLanguage?: boolean }): any;
}

const UserSchema: Schema<IUser> = new Schema({
  company: { type: Schema.Types.ObjectId, ref: Company, required: false },
  role: { type: Schema.Types.ObjectId, ref: Role, required: false },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, required: false },
  image: { type: String, required: false },
  password: { type: String, required: true },
  passport_number: { type: String, required: false },
  spouse_name: { type: String, required: false },
  father_name: { type: String, required: false },
  mother_name: { type: String, required: false },
  dob: {
    type: Date,
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
  pets: {
    type: String,
    required: false,
  },
  emergency_contact_number: {
    type: Number,
    required: false,
  },
  legal_guardians_details: {
    type: String,
    required: false,
  },
  dependents: {
    type: Number,
    required: false,
  },
  zip_code: {
    type: Number,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  designation: {
    type: Schema.Types.ObjectId,
    ref: "Designation",
    required: false,
  },
  marital_status: {
    type: Schema.Types.ObjectId,
    ref: "MaritalStatus",
    required: false,
  },
  country: {
    type: Schema.Types.ObjectId,
    ref: "Country",
    required: false,
  },
  state: {
    type: Schema.Types.ObjectId,
    ref: "State",
    required: false,
  },
  city: {
    type: Schema.Types.ObjectId,
    ref: "City",
    required: false,
  },
  employment_status: {
    type: Schema.Types.ObjectId,
    ref: "EmploymentStatus",
    required: false,
  },
  gender: {
    type: Schema.Types.ObjectId,
    ref: "Gender",
    required: false,
  },
  company_branch: {
    type: Schema.Types.ObjectId,
    ref: "CompanyBranch",
    required: false,
  },
  type: {
    type: String,
    enum: ["user", "company_user", "customer"],
    required: true,
  },
  language: [
    {
      type: Schema.Types.ObjectId,
      ref: "Language",
      required: false,
    },
  ],
  status: { type: Boolean, required: false },
});

// 🔒 Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔍 Compare password method
UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// ✅ Custom dynamic JSON response
UserSchema.methods.toProfileJSON = function (options?: {
  includeLanguage?: boolean;
}) {
  const obj = this.toObject();
  delete obj.password;

  if (!options?.includeLanguage || !obj.language || obj.language.length === 0) {
    delete obj.language;
  }

  return obj;
};

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;
