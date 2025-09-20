import mongoose, { Document, Model, Schema } from "mongoose";
import { RequestStatus } from "../../enums/RequestStatus";
import { ProductTypes } from "../../enums/productType";

// Interface for Designation Document
export interface IProductQuotations extends Document {
  company?: mongoose.Types.ObjectId;
  customer_user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: string;
  quotationStatus: RequestStatus;
  messages: string;
  company_comment: string;
  rate: number;
  product_type: ProductTypes;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

// Schema Definition
const ProductQuotationsSchema: Schema<IProductQuotations> = new Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: false,
    },
    customer_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    rate: {
      type: Number,
      required: false,
    },
    company_comment: {
      type: String,
      required: false,
    },

    product_type: {
      type: String,
      enum: Object.values(ProductTypes),
      required: false,
    },
    quantity: {
      type: String,
      required: false,
    },
    messages: {
      type: String,
      required: false,
    },
    quotationStatus: {
      type: String,
      enum: Object.values(RequestStatus),
      default: RequestStatus.Pending,
      required: true,
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
const ProductQuotations: Model<IProductQuotations> =
  mongoose.model<IProductQuotations>(
    "ProductQuotations",
    ProductQuotationsSchema
  );

export default ProductQuotations;
