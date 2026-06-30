import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";
import { interviewRoutes } from "./interview.routes";
import { profileRoutes } from "./profile.routes";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/interviews", interviewRoutes);
routes.use("/profiles", profileRoutes);
