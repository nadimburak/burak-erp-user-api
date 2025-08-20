import mongoose, { Document, Model, Schema } from "mongoose";
import Product from "../shop/Product";
import User from "../User";

// Interface
export interface IUserCart extends Document {
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    quantity: number;
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const UserCartSchema: Schema<IUserCart> = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Product,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
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
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

// Model Definition
const UserCart: Model<IUserCart> = mongoose.model<IUserCart>(
    "UserCart",
    UserCartSchema
);

export default UserCart;
