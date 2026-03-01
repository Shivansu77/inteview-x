import { Router } from "express";
import { getUsers } from "../controllers/user.controller";
import { authenticate, authorize } from "../middleware/auth";

export const userRoutes = Router();

// Protected: only authenticated admins can list all users
userRoutes.get("/", authenticate, authorize("admin"), getUsers);
