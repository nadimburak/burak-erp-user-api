import mongoose, { Schema, Document, Model, Decimal128 } from "mongoose";

// Interface for Designation Document
export interface IInvoice extends Document {
    company: mongoose.Types.ObjectId;
    appointment: mongoose.Types.ObjectId;
    company_user: mongoose.Types.ObjectId;
    customer: mongoose.Types.ObjectId;
    detail: string;
    total_amount: mongoose.Schema.Types.Decimal128;
    total_tax: mongoose.Schema.Types.Decimal128;
    total_discount: mongoose.Schema.Types.Decimal128;
    date: Date;
    status: boolean;
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const InvoiceSchema: Schema<IInvoice> = new Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: false,
        },
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true,
        },
        company_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CompanyUser",
            required: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        detail: {
            type: String,
            required: false,
        },
        total_amount: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
        },
        total_tax: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
        },
        total_discount: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
        },
        date: {
            type: Date,
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
const Invoice: Model<IInvoice> = mongoose.model<IInvoice>(
    "Invoice",
    InvoiceSchema
);

export default Invoice;