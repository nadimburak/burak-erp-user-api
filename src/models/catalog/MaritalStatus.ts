import mongoose, { Schema, Document, Model } from "mongoose";
import { StatusBool } from "../../enums/statusBool"; 

export interface IMaritalStatus extends Document {
  name: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

const MaritalStatusSchema: Schema<IMaritalStatus> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const MaritalStatus: Model<IMaritalStatus> = mongoose.model<IMaritalStatus>(
  "MaritalStatus",
  MaritalStatusSchema
);

export default MaritalStatus;
