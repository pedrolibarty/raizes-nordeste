import { Router } from "express";
import {
  createLoyaltyAccountsController,
  deleteLoyaltyAccountsController,
  listLoyaltyAccountsController,
  retrieveLoyaltyAccountsController,
  updateLoyaltyAccountsController,
} from "../controllers/loyaltyAccounts.controllers.js";
import isAuthenticatedMiddleware from "../middlewares/isAuthenticated.middleware.js";
import {
  validateCreateLoyaltyAccountsMiddleware,
  validateLoyaltyAccountIdMiddleware,
  validateUpdateLoyaltyAccountsMiddleware,
} from "../middlewares/validateLoyaltyAccounts.middleware.js";

const loyaltyAccountRoutes = Router();

loyaltyAccountRoutes.post("/", isAuthenticatedMiddleware, validateCreateLoyaltyAccountsMiddleware, createLoyaltyAccountsController);
loyaltyAccountRoutes.get("/", isAuthenticatedMiddleware, listLoyaltyAccountsController);
loyaltyAccountRoutes.get("/:id", validateLoyaltyAccountIdMiddleware, isAuthenticatedMiddleware, retrieveLoyaltyAccountsController);
loyaltyAccountRoutes.patch("/:id", validateLoyaltyAccountIdMiddleware, isAuthenticatedMiddleware, validateUpdateLoyaltyAccountsMiddleware, updateLoyaltyAccountsController);
loyaltyAccountRoutes.delete("/:id", validateLoyaltyAccountIdMiddleware, isAuthenticatedMiddleware, deleteLoyaltyAccountsController);

export default loyaltyAccountRoutes;
