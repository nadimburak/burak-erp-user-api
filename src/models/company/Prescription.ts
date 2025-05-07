import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Designation Document
export interface IPrescription extends Document {
  company: mongoose.Types.ObjectId;
  appointment: mongoose.Types.ObjectId;
  detail: string;
  date: Date;
  status: boolean;
  products: mongoose.Types.ObjectId[];
  created_at: Date;
  updated_at: Date;
}

const productSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  detail: { type: String, required: true },
});

// Schema Definition
const PrescriptionSchema: Schema<IPrescription> = new Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: false,
    },

    detail: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: Boolean,
      required: false,
    },
    products: [productSchema], // Array of product objects
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
const Prescription: Model<IPrescription> = mongoose.model<IPrescription>(
  "Prescription",
  PrescriptionSchema
);

export default Prescription;
