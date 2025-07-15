import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Country Document
export interface ICountry extends Document {
    name: string;
    iso2: string;
    iso3: string;
    numeric_code: string;
    phone_code: string;
    capital: string;
    currency: string;
    currency_name: string;
    currency_symbol: string;
    tld: string;
    native: string;
    region: string;
    subregion: string;
    nationality: string;
    latitude: string;
    longitude: string;
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
        iso2: {
            type: String,
            required: false,
        },
        iso3: {
            type: String,
            required: false,
        },
        numeric_code: {
            type: String,
            required: false,
        },
        phone_code: {
            type: String,
            required: false,
        },
        capital: {
            type: String,
            required: false,
        },
        currency: {
            type: String,
            required: false,
        },
        currency_name: {
            type: String,
            required: false,
        },
        currency_symbol: {
            type: String,
            required: false,
        },
        tld: {
            type: String,
            required: false,
        },
        native: {
            type: String,
            required: false,
        },
        region: {
            type: String,
            required: false,
        },
        subregion: {
            type: String,
            required: false,
        },
        nationality: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
        latitude: {
            type: String,
            required: false,
        },
        longitude: {
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
