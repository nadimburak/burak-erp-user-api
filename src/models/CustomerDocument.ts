import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Designation Document
export interface ICustomerDocument extends Document {
    customer: mongoose.Types.ObjectId;
    document_name: string;
    document_url: string;
    details: string;
    status: boolean;
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const CustomerDocumentSchema: Schema<ICustomerDocument> = new Schema(
    {
        customer: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer", 
            required: false,
        },
        document_name: {
            type: String,
            required: false,
        },
        document_url: {
            type: String,
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
const CustomerDocument: Model<ICustomerDocument> = mongoose.model<ICustomerDocument>(
    "CustomerDocument",
    CustomerDocumentSchema
);

export default CustomerDocument;