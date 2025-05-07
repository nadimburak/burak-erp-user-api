import express, { Request, Response } from "express";
import customerRouter from "./routes";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

// Health check endpoint
// router.get('/health', (req, res) => {
//     res.status(200).json({ status: 'OK' });
// });

app.use("/user", customerRouter);

export default app;
