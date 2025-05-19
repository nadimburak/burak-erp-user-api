import express, { Request, Response } from "express";
import authRoutes from "./auth";
import middlewareRoutes from "./middleware";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.use("/auth", authRoutes);
app.use("/middleware", middlewareRoutes);

export default app;
