import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Designation Document
export interface ICustomerBank extends Document {
    customer: mongoose.Types.ObjectId;
    bank_name: string;
    account_number: string;
    bank_code: string;
    status: boolean;
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const CustomerBankSchema: Schema<ICustomerBank> = new Schema(
    {
        customer: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer", 
            required: false,
        },
        bank_name: {
            type: String,
            required: false,
        },
        account_number: {
            type: String,
            required: true,
        },
        bank_code: {
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
const CustomerBank: Model<ICustomerBank> = mongoose.model<ICustomerBank>(
    "CustomerBank",
    CustomerBankSchema
);

export default CustomerBank;