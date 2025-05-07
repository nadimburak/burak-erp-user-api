import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Designation Document
export interface ICompanyPermission extends Document {
    company: mongoose.Types.ObjectId;
    name: string; // Surgen, Doctor, Nurse
    status: boolean; // true or false
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const CompanyPermissionSchema: Schema<ICompanyPermission> = new Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: false,
        },
        name: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
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
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, // Mongoose will manage timestamps
    }
);

// Model Definition
const CompanyPermission: Model<ICompanyPermission> = mongoose.model<ICompanyPermission>(
    "CompanyPermission",
    CompanyPermissionSchema
);

export default CompanyPermission;