import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

// Interface for Designation Document
export interface ICustomer extends Document {
    uuid: string;
    name: string;
    email: string; // true or false
    mobile: string;
    password?: string;
    dob: Date;
    address: string;
    passport_number: string;
    ethnicity: string;
    sexuality: string;
    driver: string;
    gender: mongoose.Types.ObjectId;
    pets: string;
    emergency_contact_number: string;
    marital_status: mongoose.Types.ObjectId;
    employment_status: mongoose.Types.ObjectId;
    dependents: string;
    spouses_name: string;
    for_children_under_18: boolean;
    father_name: string;
    mother_name: string;
    legal_guardians_details: string;
    status: boolean;
    created_at: Date;
    updated_at: Date;
    hid?: string;
    comparePassword(password: string): Promise<boolean>;
}

// Schema Definition
const CustomerSchema: Schema<ICustomer> = new Schema(
    {
        uuid: {
            type: String,
            required: false,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true 
        },
        mobile: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: false,
        },
        dob: {
            type: Date,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        passport_number: {
            type: String,
        },
        gender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gender",
            required: false,
        },
        ethnicity: {
            type: String,
        },
        sexuality: {
            type: String,
        },
        driver: {
            type: String,
        },
        pets: {
            type: String,
        },
        emergency_contact_number: {
            type: String,
        },
        marital_status: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MaritalStatus",
            required: false,
        },
        employment_status: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EmploymentStatus",
            required: false,
        },
        dependents: {
            type: String,
        },
        spouses_name: {
            type: String,
        },
        for_children_under_18: {
            type: Boolean,
        },
        father_name: {
            type: String,
        },
        mother_name: {
            type: String,
        },
        legal_guardians_details: {
            type: String,
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

CustomerSchema.pre<ICustomer>("save", async function (next) {
    if (!this.isModified("password")) return next();
    if(this.password){
    this.password = await bcrypt.hash(this.password, 10);
}
    next();
});

CustomerSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

// Model Definition
const Customer: Model<ICustomer> = mongoose.model<ICustomer>(
    "Customer",
    CustomerSchema
);

export default Customer;