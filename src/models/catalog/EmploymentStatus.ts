import mongoose, { Schema, Document, Model } from "mongoose";
import { StatusBool } from "../../enums/statusBool";

export interface IEmploymentStatus extends Document {
  name: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

const EmploymentStatusSchema: Schema<IEmploymentStatus> = new Schema(
  {
    name: {
      type: String,
      required: true,
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

const EmploymentStatus: Model<IEmploymentStatus> = mongoose.model<IEmploymentStatus>(
  "EmploymentStatus",
  EmploymentStatusSchema
);

export default EmploymentStatus;
