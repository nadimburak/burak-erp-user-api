import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Designation Document
export interface IGender extends Document {
    name: string; 
    status: boolean; // true or false
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const GenderSchema: Schema<IGender> = new Schema(
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
const Gender: Model<IGender> = mongoose.model<IGender>(
    "Gender",
    GenderSchema
);

export default Gender;