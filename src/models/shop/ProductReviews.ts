import mongoose, { Document, Model, Schema } from "mongoose";
import { RequestStatus } from "../../enums/RequestStatus";
import { ProductTypes } from "../../enums/productType";


// Interface for Designation Document
export interface IProductReviews extends Document {
    company?: mongoose.Types.ObjectId;
    customer_user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    image: string;
    status: boolean;
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const ProductReviewsSchema: Schema<IProductReviews> = new Schema(
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
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: false,
        },
        image: {
            type: String,
            required: false,
        },
        comment: {
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
const ProductReviews: Model<IProductReviews> = mongoose.model<IProductReviews>(
    "ProductReviews",
    ProductReviewsSchema
);

export default ProductReviews;
