import "dotenv/config";
import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import { connectDb } from "./config/db";
import { routes } from "./routes";
import { errorHandler } from "./middleware/errorHandler";

// Connect to database
const start = async () => {
  try {
    await connectDb();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
};
start();

const app = express();
const PORT = process.env.PORT || 8000;

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

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
