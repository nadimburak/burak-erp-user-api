import mongoose, { Document, Model, Schema } from "mongoose";

// Interface for City Document
export interface ICity extends Document {
  country: mongoose.Types.ObjectId; // Reference to Country model
  state: mongoose.Types.ObjectId; // Reference to State model
  name: string; // Surgen, Doctor, Nurse
  description: string;
  status: boolean; // true or false
  created_at: Date;
  updated_at: Date;
}

// Schema Definition
const CitySchema: Schema<ICity> = new Schema(
  {
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
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, // Mongoose will manage timestamps
  }
);

// Model Definition
const City: Model<ICity> = mongoose.model<ICity>(
  "City",
  CitySchema
);

export default City;
