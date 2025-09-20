import express, { Request, Response } from "express";
import { seedDB } from "../seeder";
import authRoutes from "./auth";

import designationRoutes from "./catalog/designations";
import EmploymentStatusRoutes from "./catalog/employmentStatus";
import industryRoutes from "./catalog/industry";
import languageRoutes from "./catalog/language";
import MaritalStatusRoutes from "./catalog/maritalStatus";

import companyBranchRoutes from "./company/companyBranch";

import { Gender } from "../enums/gender";
import middlewareRoutes from "./middleware";
import permissionRoutes from "./permissions";
import roleRoutes from "./roles";
import userRoutes from "./users";
import { authenticate } from "../middlewares/auth.middleware";
import userChatRoutes from "./chat/userChat";
import userCartRoutes from "./shopping/userCart";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express! User Api is running.");
});

app.get("/seed", (req: Request, res: Response) => {
  try {
    seedDB();
    res.send("Seeder run successfully!");
  } catch (error) {
    console.error("MongoDB test error:", error);
    res.status(500).json({ error: "MongoDB operation failed" });
  }
});

app.use("/auth", authRoutes);

app.use(authenticate);

app.use("/middleware", middlewareRoutes);

app.use("/user", [permissionRoutes, roleRoutes, userRoutes]);

app.use("/company", [companyBranchRoutes]);

app.use("/catalog", [
  languageRoutes,
  EmploymentStatusRoutes,
  MaritalStatusRoutes,
  designationRoutes,
  industryRoutes,
]);

app.use("/chat", [
  userChatRoutes,
]);

app.use("/shopping", [
  userCartRoutes,
]);

// GET /catalog/genders
app.get("/genders", (_req, res) => {
  const genderOptions = Object.entries(Gender).map(([key, value]) => ({
    _id: value,
    name: key.charAt(0) + key.slice(1).toLowerCase(), // "Male", "Female", etc.
  }));

  res.json({ data: genderOptions });
});

export default app;
