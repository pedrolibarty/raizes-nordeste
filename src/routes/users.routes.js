import { Router } from "express";
import { USER_ROLES } from "../constants/user-roles.js";
import {
  createUsersController,
  deleteUsersController,
  listUsersController,
  loginUsersController,
  retrieveUsersController,
  updateUsersController,
} from "../controllers/users.controllers.js";
import isLoggedInMiddleware from "../middlewares/isLoggedIn.middleware.js";
import validateLoginMiddleware from "../middlewares/validateLogin.middleware.js";
import {
  validateCreateUsersMiddleware,
  validateUpdateUsersMiddleware,
  validateUserIdMiddleware,
} from "../middlewares/validateUsers.middleware.js";
import verifyUserRoleMiddleware from "../middlewares/verifyUserRole.middleware.js";

const userRoutes = Router();

userRoutes.post("/login", validateLoginMiddleware, loginUsersController);
userRoutes.post(
  "/",
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  validateCreateUsersMiddleware,
  createUsersController,
);
userRoutes.get(
  "/",
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  listUsersController,
);
userRoutes.get(
  "/:id",
  validateUserIdMiddleware,
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  retrieveUsersController,
);
userRoutes.patch(
  "/:id",
  validateUserIdMiddleware,
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  validateUpdateUsersMiddleware,
  updateUsersController,
);
userRoutes.delete(
  "/:id",
  validateUserIdMiddleware,
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  deleteUsersController,
);

export default userRoutes;
