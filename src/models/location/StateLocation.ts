import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for StateLocation Document
export interface IStateLocation extends Document {
  country: mongoose.Types.ObjectId; // Reference to CountryLocation model
  name: string; // Surgen, Doctor, Nurse
  description: string;
  status: boolean; // true or false
  created_at: Date;
  updated_at: Date;
}

// Schema Definition
const StateLocationSchema: Schema<IStateLocation> = new Schema(
  {
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CountryLocation",
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
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, // Mongoose will manage timestamps
  }
);

// Model Definition
const StateLocation: Model<IStateLocation> = mongoose.model<IStateLocation>(
  "StateLocation",
  StateLocationSchema
);

export default StateLocation;
