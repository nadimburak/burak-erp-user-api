import mongoose, { Document, Model, Schema } from "mongoose";

export interface IIndustry extends Document {
  name: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

const IndustrySchema: Schema<IIndustry> = new Schema(
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

const Industry: Model<IIndustry> = mongoose.model<IIndustry>(
  "Industry",
  IndustrySchema
);

export default Industry;
