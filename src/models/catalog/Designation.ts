import mongoose, { Document, Model, Schema } from "mongoose";

export interface IDesignation extends Document {
  industries: mongoose.Schema.Types.ObjectId; // Reference to Industries model
  name: string; // Surgen, Doctor, Nurse
  description: string;
  status: boolean; // true or false
  created_at: Date;
  updated_at: Date;
}

const DesignationSchema: Schema<IDesignation> = new Schema(
  {
    industries: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Industry",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
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
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Designation: Model<IDesignation> = mongoose.model<IDesignation>(
  "Designation",
  DesignationSchema
);

export default Designation;
