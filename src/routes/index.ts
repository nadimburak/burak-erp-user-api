import express, { Request, Response } from "express";
import authRoutes from "./auth";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.use("/auth", authRoutes);

export default app;
