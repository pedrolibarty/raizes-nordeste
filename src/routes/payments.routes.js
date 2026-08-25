import { Router } from "express";
import {
  listPaymentsController,
  processMockPaymentsController,
  retrievePaymentsController,
} from "../controllers/payments.controllers.js";
import isAuthenticatedMiddleware from "../middlewares/isAuthenticated.middleware.js";
import validateMockPaymentsMiddleware from "../middlewares/validateMockPayments.middleware.js";
import validatePaymentIdMiddleware from "../middlewares/validatePayments.middleware.js";

const paymentRoutes = Router();

paymentRoutes.post(
  "/mock/:result",
  isAuthenticatedMiddleware,
  validateMockPaymentsMiddleware,
  processMockPaymentsController,
);
paymentRoutes.get("/", isAuthenticatedMiddleware, listPaymentsController);
paymentRoutes.get(
  "/:id",
  validatePaymentIdMiddleware,
  isAuthenticatedMiddleware,
  retrievePaymentsController,
);

export default paymentRoutes;
