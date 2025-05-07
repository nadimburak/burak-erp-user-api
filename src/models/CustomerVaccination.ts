import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Designation Document
export interface ICustomerVaccination extends Document {
    customer: mongoose.Types.ObjectId;
    vaccination: mongoose.Types.ObjectId;
    details: string;
    status: boolean;
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const CustomerVaccinationSchema: Schema<ICustomerVaccination> = new Schema(
    {
        customer: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer", 
            required: false,
        },
        vaccination: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vaccination", 
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
const CustomerVaccination: Model<ICustomerVaccination> = mongoose.model<ICustomerVaccination>(
    "CustomerVaccination",
    CustomerVaccinationSchema
);

export default CustomerVaccination;