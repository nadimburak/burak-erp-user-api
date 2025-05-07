import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Designation Document
export interface IMedicalCoverType extends Document {
    name: string;
    status: boolean;
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const MedicalCoverTypeSchema: Schema<IMedicalCoverType> = new Schema(
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
const MedicalCoverType: Model<IMedicalCoverType> = mongoose.model<IMedicalCoverType>(
    "MedicalCoverType",
    MedicalCoverTypeSchema
);

export default MedicalCoverType;