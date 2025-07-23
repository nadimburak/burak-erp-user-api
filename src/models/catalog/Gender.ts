import mongoose, { Schema, Document, Model } from "mongoose";
import { StatusBool } from "../../enums/statusBool"; 

export interface IGender extends Document {
  name: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

const GenderSchema: Schema<IGender> = new Schema(
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

const Gender: Model<IGender> = mongoose.model<IGender>("Gender", GenderSchema);

export default Gender;
