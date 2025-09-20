import mongoose, { Document, Model, Schema } from "mongoose";
import Brand from "./Brand";

// Interface for Designation Document
export interface IProduct extends Document {
  company: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  brand: mongoose.Types.ObjectId;
  fuel_type: mongoose.Types.ObjectId;
  name: string;
  description: string;
  duration: string;
  minimum_quantity: number;
  price: number;
  model_no: string;
  image: string;
  manufacture_date: Date;
  expiry_date: Date;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

// Schema Definition
const ProductSchema: Schema<IProduct> = new Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: false,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    fuel_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FuelType",
      required: false,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Brand,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    duration: {
      type: String,
      required: false,
    },
    model_no: {
      type: String,
      required: false,
    },
    minimum_quantity: {
      type: Number,
      required: false,
      default: 1,
    },
    manufacture_date: {
      type: Date,
      required: false,
    },
    expiry_date: {
      type: Date,
      required: false,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      required: false,
    },
    status: {
      type: Boolean,
      required: false,
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
