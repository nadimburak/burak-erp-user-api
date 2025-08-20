import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProductImage extends Document {
  product: mongoose.Types.ObjectId;
  product_url: string;
  title: string;
  description: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

const ProductImageSchema: Schema<IProductImage> = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true, // Changed to required
    },
    product_url: {
      type: String,
      required: true, // Changed to required
    },
    title: {
      type: String,
      required: true, // Changed to required
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const ProductImage: Model<IProductImage> = mongoose.model<IProductImage>(
  "ProductImage",
  ProductImageSchema
);

export default ProductImage;