import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Designation Document
export interface ICustomerAllergy extends Document {
    customer: mongoose.Types.ObjectId;
    allergy: mongoose.Types.ObjectId;
    details: string;
    status: boolean;
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const CustomerAllergySchema: Schema<ICustomerAllergy> = new Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: false,
        },
        allergy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Allergy",
            required: false,
        },
        details: {
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
const CustomerAllergy: Model<ICustomerAllergy> = mongoose.model<ICustomerAllergy>(
    "CustomerAllergy",
    CustomerAllergySchema
);

export default CustomerAllergy;