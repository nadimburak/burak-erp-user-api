import dotenv from "dotenv";
import mongoose from "mongoose";
import Permission from "./models/Permission";
import Role from "./models/Role";
import User from "./models/User";
import { adminPermissions } from "./utils/adminPermissions";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedDB = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error("MONGO_URI is not defined in .env file");
        }

        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Remove old data
        await Permission.deleteMany();
        console.log("🗑️ Old permissions removed");

        // Insert new permissions
        const insertedPermissions = await Permission.insertMany(adminPermissions);
        console.log("✅ New permissions added");

        await Role.deleteMany();
        console.log("🗑️ Old roles removed");

        // Create Super Admin Role
        const superAdminRole = await Role.create({
            name: "Super Admin",
            status: true,
            permissions: insertedPermissions.map((p: any) => p._id),
        });
        console.log("✅ Super Admin role added");


        await User.deleteMany();
        console.log("🗑️ Old users removed");

        // Create Super Admin User
        const adminUser = await User.create({
            name: "Super Admin",
            email: "admin@gmail.com",
            status: true,
            password: "Abcd@1234",
            role: superAdminRole._id,
        });
        console.log("✅ Super Admin user added", adminUser);


        await mongoose.disconnect();
        process.exit();
    } catch (error) {
        console.error("❌ Error seeding data:", error);
        process.exit(1);
    }
};

seedDB();
