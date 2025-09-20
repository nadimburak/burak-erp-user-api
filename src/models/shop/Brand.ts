import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBrand extends Document {
  industries: mongoose.Schema.Types.ObjectId; // Reference to Industries model
  name: string;
  brand_image?: string; // optional as per table
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

const BrandSchema: Schema<IBrand> = new Schema(
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
    brand_image: {
      type: String,
      required: false,
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

const Brand: Model<IBrand> = mongoose.model<IBrand>("Brand", BrandSchema);

export default Brand;
