import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for CountryLocation Document
export interface ICountryLocation extends Document {
    name: string; // Surgen, Doctor, Nurse
    description: string;
    status: boolean; // true or false
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const CountryLocationSchema: Schema<ICountryLocation> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
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
const CountryLocation: Model<ICountryLocation> = mongoose.model<ICountryLocation>(
    "CountryLocation",
    CountryLocationSchema
);

export default CountryLocation;
