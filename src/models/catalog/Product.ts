import mongoose, { Document, Model, Schema } from "mongoose";

// Interface for Designation Document
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  status: boolean; // true or false
  created_at: Date;
  updated_at: Date;
  category: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
}

// Schema Definition
const ProductSchema: Schema<IProduct> = new Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
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
const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  ProductSchema
);

export default Product;
