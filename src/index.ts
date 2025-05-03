import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from 'path';

import cors from "cors";
import adminRouter from "./routes"

// Load environment variables
dotenv.config();

const app = express();

// Basic CORS configuration
app.use(cors());

// Read environment variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
mongoose
  .connect(MONGO_URI as string, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process on DB connection failure
  });

// Basic route for health check
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

// Routes
app.use("/admin", adminRouter);
app.use('/storage', express.static(path.join(__dirname, '../uploads')));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
