import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Designation Document
export interface IReportDocument extends Document {
    appointment: mongoose.Types.ObjectId;
    company: mongoose.Types.ObjectId;
    customer: mongoose.Types.ObjectId;
    company_user: mongoose.Types.ObjectId;
    details: string;
    url: string;
    date: Date;
    status: boolean;
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const ReportDocumentSchema: Schema<IReportDocument> = new Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: false,
        },
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: false,
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: false,
        },
        company_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CompanyUser",
            required: false,
        },
        details: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        },
        date: {
            type: Date,
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
const ReportDocument: Model<IReportDocument> = mongoose.model<IReportDocument>(
    "ReportDocument",
    ReportDocumentSchema
);

export default ReportDocument;