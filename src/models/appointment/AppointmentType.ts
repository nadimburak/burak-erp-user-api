import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Designation Document
export interface IAppointmentType extends Document {
    name: string;
    status: boolean;
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const AppointmentTypeSchema: Schema<IAppointmentType> = new Schema(
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
const AppointmentType: Model<IAppointmentType> = mongoose.model<IAppointmentType>(
    "AppointmentType",
    AppointmentTypeSchema
);

export default AppointmentType;