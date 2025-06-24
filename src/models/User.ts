import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import Company from "./company/Company";
import Role from "./Role";

export type UserType = "user" | "company_user" | "customer";

export interface IUser extends Document {
  company: mongoose.Types.ObjectId;
  role: mongoose.Types.ObjectId;
  name: string;
  mobile?: number;
  email: string;
  password: string;
  father_name?: string;
  mother_name?: string;
  status: boolean;
  type: UserType;
  gender?: mongoose.Types.ObjectId;
  company_branch?: mongoose.Types.ObjectId;
  language?: mongoose.Types.ObjectId[];
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
  company: { type: Schema.Types.ObjectId, ref: Company, required: false },
  role: { type: Schema.Types.ObjectId, ref: Role, required: false },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, required: false },
  password: { type: String, required: true },
  father_name: { type: String, required: false },
  mother_name: { type: String, required: false },
  status: { type: Boolean, required: false },
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

// ✅ Smart field hiding in JSON output
UserSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password; // Always hide password

    // Hide fields if they are null/undefined/empty
    if (!ret.language || ret.language.length === 0) delete ret.language;
    // if (!ret.role) delete ret.role;

    return ret;
  },
});

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;
