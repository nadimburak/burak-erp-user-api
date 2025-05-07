import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Designation Document
export interface ICustomerMedicalCondition extends Document {
    customer: mongoose.Types.ObjectId;
    medical_condition: mongoose.Types.ObjectId;
    details: string;
    status: boolean;
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const CustomerMedicalConditionSchema: Schema<ICustomerMedicalCondition> = new Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: false,
        },
        medical_condition: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MedicalCondition",
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
const CustomerMedicalCondition: Model<ICustomerMedicalCondition> = mongoose.model<ICustomerMedicalCondition>(
    "CustomerMedicalCondition",
    CustomerMedicalConditionSchema
);

export default CustomerMedicalCondition;