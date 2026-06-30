import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller";
import { authenticate } from "../middleware/auth";

export const profileRoutes = Router();

profileRoutes.use(authenticate);

profileRoutes.get("/", getProfile);
profileRoutes.post("/", updateProfile);
profileRoutes.put("/", updateProfile);
