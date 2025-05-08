import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Designation Document
export interface IAppointment extends Document {
    customer: mongoose.Types.ObjectId;
    company: mongoose.Types.ObjectId;
    company_user: mongoose.Types.ObjectId;
    appointment_type: mongoose.Types.ObjectId;
    uuid: string;
    detail: string;
    status: boolean;
    date: Date;
    services?: mongoose.Types.ObjectId[];
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const AppointmentSchema: Schema<IAppointment> = new Schema(
    {
        uuid: {
            type: String,
            required: false,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        company_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CompanyUser",
            required: true,
        },
        appointment_type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AppointmentType",
            required: true,
        },
        detail: {
            type: String,
            required: false,
        },
        status: {
            type: Boolean,
            required: false,
        },
        date: {
            type: Date,
            required: false,
        },
        services: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "CompanyService",

        }],
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
const Appointment: Model<IAppointment> = mongoose.model<IAppointment>(
    "Appointment",
    AppointmentSchema
);

export default Appointment;