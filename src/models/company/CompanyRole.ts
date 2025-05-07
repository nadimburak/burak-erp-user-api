import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Designation Document
export interface ICompanyRole extends Document {
    company: mongoose.Types.ObjectId;
    name: string;
    status: string;
    permissions: mongoose.Types.ObjectId[];
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const CompanyRoleSchema: Schema<ICompanyRole> = new Schema(
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
            type: String,
            required: true,
        },
        permissions: [{ type: Schema.Types.ObjectId, ref: 'CompanyPermission' }],
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
const CompanyRole: Model<ICompanyRole> = mongoose.model<ICompanyRole>(
    "CompanyRole",
    CompanyRoleSchema
);

export default CompanyRole;