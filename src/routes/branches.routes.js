import { Router } from "express";
import { USER_ROLES } from "../constants/user-roles.js";
import {
  createBranchesController,
  deleteBranchesController,
  listBranchesController,
  retrieveBranchesController,
  updateBranchesController,
} from "../controllers/branches.controllers.js";
import isLoggedInMiddleware from "../middlewares/isLoggedIn.middleware.js";
import {
  validateBranchIdMiddleware,
  validateCreateBranchesMiddleware,
  validateUpdateBranchesMiddleware,
} from "../middlewares/validateBranches.middleware.js";
import verifyUserRoleMiddleware from "../middlewares/verifyUserRole.middleware.js";

const branchRoutes = Router();

branchRoutes.post(
  "/",
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(USER_ROLES.ADMIN),
  validateCreateBranchesMiddleware,
  createBranchesController,
);
branchRoutes.get("/", listBranchesController);
branchRoutes.get("/:id", validateBranchIdMiddleware, retrieveBranchesController);
branchRoutes.patch(
  "/:id",
  validateBranchIdMiddleware,
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  validateUpdateBranchesMiddleware,
  updateBranchesController,
);
branchRoutes.delete(
  "/:id",
  validateBranchIdMiddleware,
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(USER_ROLES.ADMIN),
  deleteBranchesController,
);

export default branchRoutes;
