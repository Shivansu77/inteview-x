import { Router } from "express";
import { getUsers, registerUser } from "../controllers/user.controller";

export const userRoutes = Router();

userRoutes.get("/", getUsers);
userRoutes.post("/register", registerUser);
