import dotenv from "dotenv";
import mongoose from "mongoose";
import Permission from "./models/Permission";
import Role from "./models/Role";
import User from "./models/User";
import { adminPermissions } from "./utils/adminPermissions";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedDB = async () => {
    if (!MONGO_URI) {
        console.error("❌ MONGO_URI is not defined in .env file");
        process.exit(1);
    }

    try {
        // Connect to MongoDB with optimized settings
        await mongoose.connect(MONGO_URI, {
            connectTimeoutMS: 5000,
            socketTimeoutMS: 30000,
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10
        });
        console.log("✅ Connected to MongoDB");

        // Use transactions for atomic operations
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Clear existing data in parallel where possible
            await Promise.all([
                Permission.deleteMany({}).session(session),
                Role.deleteMany({}).session(session),
                User.deleteMany({}).session(session)
            ]);
            console.log("🗑️ Old data removed");

            // Insert new permissions
            const insertedPermissions = await Permission.insertMany(
                adminPermissions.map(p => ({ ...p })),
                { session }
            );
            console.log(`✅ ${insertedPermissions.length} permissions added`);

            // Create Super Admin Role
            const superAdminRole = new Role({
                name: "Super Admin",
                status: true,
                permissions: insertedPermissions.map(p => p._id),
            });
            await superAdminRole.save({ session });
            console.log("✅ Super Admin role added");

            // Create Super Admin User with hashed password (recommended)
            const adminUser = new User({
                name: "Super Admin",
                email: "admin@gmail.com",
                status: true,
                password: "Abcd@1234", // In production, hash this before saving
                role: superAdminRole._id,
            });
            await adminUser.save({ session });
            console.log("✅ Super Admin user added");

            await session.commitTransaction();
            console.log("🚀 Database seeding completed successfully");
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error("❌ Error seeding database:", error instanceof Error ? error.message : error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

seedDB();