import { Router } from "express";
import { USER_ROLES } from "../constants/user-roles.js";
import {
  createProductsController,
  deleteProductsController,
  listProductsController,
  retrieveProductsController,
  updateProductsController,
} from "../controllers/products.controllers.js";
import isLoggedInMiddleware from "../middlewares/isLoggedIn.middleware.js";
import {
  validateCreateProductsMiddleware,
  validateProductIdMiddleware,
  validateUpdateProductsMiddleware,
} from "../middlewares/validateProducts.middleware.js";
import verifyUserRoleMiddleware from "../middlewares/verifyUserRole.middleware.js";

const productRoutes = Router();

productRoutes.post(
  "/",
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  validateCreateProductsMiddleware,
  createProductsController,
);
productRoutes.get("/", listProductsController);
productRoutes.get(
  "/:id",
  validateProductIdMiddleware,
  retrieveProductsController,
);
productRoutes.patch(
  "/:id",
  validateProductIdMiddleware,
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  validateUpdateProductsMiddleware,
  updateProductsController,
);
productRoutes.delete(
  "/:id",
  validateProductIdMiddleware,
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  deleteProductsController,
);

export default productRoutes;
