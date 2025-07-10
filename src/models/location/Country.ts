import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Country Document
export interface ICountry extends Document {
    name: string; // Surgen, Doctor, Nurse
    description: string;
    status: boolean; // true or false
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const CountrySchema: Schema<ICountry> = new Schema(
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
const Country: Model<ICountry> = mongoose.model<ICountry>(
    "Country",
    CountrySchema
);

export default Country;
