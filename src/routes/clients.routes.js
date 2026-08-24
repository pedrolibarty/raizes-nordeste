import { Router } from "express";
import { USER_ROLES } from "../constants/user-roles.js";
import {
  createClientsController,
  deleteClientsController,
  listClientsController,
  loginClientsController,
  retrieveClientsController,
  updateClientsController,
} from "../controllers/clients.controllers.js";
import isAuthenticatedMiddleware from "../middlewares/isAuthenticated.middleware.js";
import isLoggedInMiddleware from "../middlewares/isLoggedIn.middleware.js";
import validateLoginMiddleware from "../middlewares/validateLogin.middleware.js";
import {
  validateClientIdMiddleware,
  validateCreateClientsMiddleware,
  validateUpdateClientsMiddleware,
} from "../middlewares/validateClients.middleware.js";
import verifyClientOwnerOrUserRoleMiddleware from "../middlewares/verifyClientOwnerOrUserRole.middleware.js";
import verifyUserRoleMiddleware from "../middlewares/verifyUserRole.middleware.js";

const clientRoutes = Router();

clientRoutes.post("/login", validateLoginMiddleware, loginClientsController);
clientRoutes.post("/", validateCreateClientsMiddleware, createClientsController);
clientRoutes.get(
  "/",
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  listClientsController,
);
clientRoutes.get(
  "/:id",
  validateClientIdMiddleware,
  isAuthenticatedMiddleware,
  verifyClientOwnerOrUserRoleMiddleware(
    USER_ROLES.ADMIN,
    USER_ROLES.MANAGER,
  ),
  retrieveClientsController,
);
clientRoutes.patch(
  "/:id",
  validateClientIdMiddleware,
  isAuthenticatedMiddleware,
  verifyClientOwnerOrUserRoleMiddleware(USER_ROLES.ADMIN),
  validateUpdateClientsMiddleware,
  updateClientsController,
);
clientRoutes.delete(
  "/:id",
  validateClientIdMiddleware,
  isAuthenticatedMiddleware,
  verifyClientOwnerOrUserRoleMiddleware(USER_ROLES.ADMIN),
  deleteClientsController,
);

export default clientRoutes;
