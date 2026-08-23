import { Router } from "express";
import { USER_ROLES } from "../constants/user-roles.js";
import {
  createMovementsController,
  listMovementsController,
  retrieveMovementsController,
} from "../controllers/movements.controllers.js";
import isLoggedInMiddleware from "../middlewares/isLoggedIn.middleware.js";
import {
  validateCreateMovementsMiddleware,
  validateMovementIdMiddleware,
} from "../middlewares/validateMovements.middleware.js";
import verifyUserRoleMiddleware from "../middlewares/verifyUserRole.middleware.js";

const movementRoutes = Router();

movementRoutes.post(
  "/",
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  validateCreateMovementsMiddleware,
  createMovementsController,
);
movementRoutes.get(
  "/",
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(
    USER_ROLES.ADMIN,
    USER_ROLES.MANAGER,
    USER_ROLES.KITCHEN,
  ),
  listMovementsController,
);
movementRoutes.get(
  "/:id",
  validateMovementIdMiddleware,
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(
    USER_ROLES.ADMIN,
    USER_ROLES.MANAGER,
    USER_ROLES.KITCHEN,
  ),
  retrieveMovementsController,
);

export default movementRoutes;
