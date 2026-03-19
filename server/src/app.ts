import "dotenv/config";
import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import { connectDb } from "./config/db";
import { User } from "./models/user.model";
import { routes } from "./routes";
import { errorHandler } from "./middleware/errorHandler";

export const initDb = async () => {
  await connectDb();
  await User.init();
};

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

app.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "InterviewAce API is running 🚀",
    version: "1.0.0",
  });
});

// Error handling
app.use(errorHandler);

export default app;
