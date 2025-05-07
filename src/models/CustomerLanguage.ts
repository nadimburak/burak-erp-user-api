import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Designation Document
export interface ICustomerLanguage extends Document {
    customer: mongoose.Types.ObjectId; // Reference to Role
    language: mongoose.Types.ObjectId;
}

// Schema Definition
const CustomerLanguageSchema: Schema<ICustomerLanguage> = new Schema(
    {

        customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
        language: { type: mongoose.Schema.Types.ObjectId, ref: "Language", required: true },

    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, // Mongoose will manage timestamps
    }
);

// Model Definition
const CustomerLanguage: Model<ICustomerLanguage> = mongoose.model<ICustomerLanguage>(
    "CustomerLanguage",
    CustomerLanguageSchema
);

export default CustomerLanguage;
