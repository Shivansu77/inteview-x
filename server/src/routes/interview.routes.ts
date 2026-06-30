import { Router } from "express";
import { saveInterview, getUserInterviews, deleteInterview, clearUserInterviews } from "../controllers/interview.controller";
import { authenticate } from "../middleware/auth";

export const interviewRoutes = Router();

interviewRoutes.use(authenticate);

interviewRoutes.post("/", saveInterview);
interviewRoutes.get("/", getUserInterviews);
interviewRoutes.delete("/", clearUserInterviews);
interviewRoutes.delete("/:id", deleteInterview);
