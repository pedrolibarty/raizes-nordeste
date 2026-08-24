import { Router } from "express";
import {
  createLoyaltyTransactionsController,
  listLoyaltyTransactionsController,
  retrieveLoyaltyTransactionsController,
} from "../controllers/loyaltyTransactions.controllers.js";
import isAuthenticatedMiddleware from "../middlewares/isAuthenticated.middleware.js";
import {
  validateCreateLoyaltyTransactionsMiddleware,
  validateLoyaltyTransactionIdMiddleware,
} from "../middlewares/validateLoyaltyTransactions.middleware.js";

const loyaltyTransactionRoutes = Router();

loyaltyTransactionRoutes.post("/", isAuthenticatedMiddleware, validateCreateLoyaltyTransactionsMiddleware, createLoyaltyTransactionsController);
loyaltyTransactionRoutes.get("/", isAuthenticatedMiddleware, listLoyaltyTransactionsController);
loyaltyTransactionRoutes.get("/:id", validateLoyaltyTransactionIdMiddleware, isAuthenticatedMiddleware, retrieveLoyaltyTransactionsController);

export default loyaltyTransactionRoutes;
