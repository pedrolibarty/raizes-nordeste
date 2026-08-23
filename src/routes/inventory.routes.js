import { Router } from "express";
import { USER_ROLES } from "../constants/user-roles.js";
import {
  listInventoryByBranchController,
  listInventoryController,
  retrieveInventoryByProductController,
  retrieveInventoryController,
} from "../controllers/inventory.controllers.js";
import isLoggedInMiddleware from "../middlewares/isLoggedIn.middleware.js";
import {
  validateInventoryBranchIdMiddleware,
  validateInventoryIdMiddleware,
  validateInventoryProductIdMiddleware,
} from "../middlewares/validateInventory.middleware.js";
import verifyUserRoleMiddleware from "../middlewares/verifyUserRole.middleware.js";

const inventoryRoutes = Router();

inventoryRoutes.use(
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(
    USER_ROLES.ADMIN,
    USER_ROLES.MANAGER,
    USER_ROLES.KITCHEN,
  ),
);

inventoryRoutes.get("/", listInventoryController);
inventoryRoutes.get(
  "/product/:productId",
  validateInventoryProductIdMiddleware,
  retrieveInventoryByProductController,
);
inventoryRoutes.get(
  "/branch/:branchId",
  validateInventoryBranchIdMiddleware,
  listInventoryByBranchController,
);
inventoryRoutes.get(
  "/:id",
  validateInventoryIdMiddleware,
  retrieveInventoryController,
);

export default inventoryRoutes;
