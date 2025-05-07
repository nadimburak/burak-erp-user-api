import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Designation Document
export interface ICompanyCustomer extends Document {
    uuid: string;
    company: mongoose.Types.ObjectId;
    customer: mongoose.Types.ObjectId;
    hid: string;
    status: boolean;
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const CompanyCustomerSchema: Schema<ICompanyCustomer> = new Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: false,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: false,
        },
        hid: {
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
const CompanyCustomer: Model<ICompanyCustomer> = mongoose.model<ICompanyCustomer>(
    "CompanyCustomer",
    CompanyCustomerSchema
);

export default CompanyCustomer;