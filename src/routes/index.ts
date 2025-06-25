import express, { Request, Response } from "express";
import { seedDB } from "../seeder";
import authRoutes from "./auth";
import genderRoutes from "./catalog/gender";
import languageRoutes from "./catalog/language";
import companyBranchRoutes from "./company/companyBranch";
import middlewareRoutes from "./middleware";
import permissionRoutes from "./permissions";
import roleRoutes from "./roles";
import userRoutes from "./users";

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
app.use("/middleware", middlewareRoutes);
app.use("/user", [permissionRoutes, roleRoutes, userRoutes]);
app.use("/company", [companyBranchRoutes]);
app.use("/catalog", [genderRoutes, languageRoutes]);

export default app;
