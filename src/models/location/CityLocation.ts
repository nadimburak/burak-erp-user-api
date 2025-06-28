import mongoose, { Document, Model, Schema } from "mongoose";

// Interface for CityLocation Document
export interface ICityLocation extends Document {
  country_location: mongoose.Types.ObjectId; // Reference to CountryLocation model
  state_location: mongoose.Types.ObjectId; // Reference to StateLocation model
  name: string; // Surgen, Doctor, Nurse
  description: string;
  status: boolean; // true or false
  created_at: Date;
  updated_at: Date;
}

// Schema Definition
const CityLocationSchema: Schema<ICityLocation> = new Schema(
  {
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
const CityLocation: Model<ICityLocation> = mongoose.model<ICityLocation>(
  "CityLocation",
  CityLocationSchema
);

export default CityLocation;
