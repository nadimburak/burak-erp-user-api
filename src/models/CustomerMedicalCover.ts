import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Designation Document
export interface ICustomerMedicalCover extends Document {
    customer: mongoose.Types.ObjectId;
    medical_cover_type: mongoose.Types.ObjectId;
    details: string;
    start_date: Date;
    end_date: Date;
    status: boolean;
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const CustomerMedicalCoverSchema: Schema<ICustomerMedicalCover> = new Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: false,
        },
        medical_cover_type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MedicalCoverType",
            required: false,
        },
        details: {
            type: String,
            required: false,
        },
        start_date: {
            type: Date,
        },
        end_date: {
            type: Date,
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
const CustomerMedicalCover: Model<ICustomerMedicalCover> = mongoose.model<ICustomerMedicalCover>(
    "CustomerMedicalCover",
    CustomerMedicalCoverSchema
);

export default CustomerMedicalCover;