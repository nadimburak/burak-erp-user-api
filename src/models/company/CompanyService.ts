import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Designation Document
export interface ICompanyService extends Document {
    company: mongoose.Types.ObjectId;
    service_name: string;
    cost_usd: string;
    cost_zig: string;
    status: boolean;
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const CompanyServiceSchema: Schema<ICompanyService> = new Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: false,
        },
        service_name: {
            type: String,
            required: true,
        },
        cost_usd: {
            type: String,
            required: true,
        },
        cost_zig: {
            type: String,
            required: true,
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
const CompanyService: Model<ICompanyService> = mongoose.model<ICompanyService>(
    "CompanyService",
    CompanyServiceSchema
);

export default CompanyService;