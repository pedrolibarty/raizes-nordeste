import { Router } from "express";
import { USER_ROLES } from "../constants/user-roles.js";
import {
  createPromotionsController,
  deletePromotionsController,
  listPromotionsController,
  retrievePromotionsController,
  updatePromotionsController,
} from "../controllers/promotions.controllers.js";
import isLoggedInMiddleware from "../middlewares/isLoggedIn.middleware.js";
import {
  validateCreatePromotionsMiddleware,
  validatePromotionIdMiddleware,
  validateUpdatePromotionsMiddleware,
} from "../middlewares/validatePromotions.middleware.js";
import verifyUserRoleMiddleware from "../middlewares/verifyUserRole.middleware.js";

const promotionRoutes = Router();

promotionRoutes.post(
  "/",
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  validateCreatePromotionsMiddleware,
  createPromotionsController,
);
promotionRoutes.get("/", listPromotionsController);
promotionRoutes.get(
  "/:id",
  validatePromotionIdMiddleware,
  retrievePromotionsController,
);
promotionRoutes.patch(
  "/:id",
  validatePromotionIdMiddleware,
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  validateUpdatePromotionsMiddleware,
  updatePromotionsController,
);
promotionRoutes.delete(
  "/:id",
  validatePromotionIdMiddleware,
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  deletePromotionsController,
);

export default promotionRoutes;
