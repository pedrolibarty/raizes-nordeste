import { Router } from "express";
import { loginUsersController } from "../controllers/users.controllers.js";
import validateLoginMiddleware from "../middlewares/validateLogin.middleware.js";

const userRoutes = Router();

userRoutes.post("/login", validateLoginMiddleware, loginUsersController);

export default userRoutes;
