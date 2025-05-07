import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Designation Document
export interface ILanguage extends Document {
    name: string; 
    status: boolean; // true or false
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const LanguageSchema: Schema<ILanguage> = new Schema(
    {
        name: {
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
const Language: Model<ILanguage> = mongoose.model<ILanguage>(
    "Language",
    LanguageSchema
);

export default Language;