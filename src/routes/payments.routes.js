import { Router } from "express";
import { processMockPaymentsController } from "../controllers/payments.controllers.js";
import isAuthenticatedMiddleware from "../middlewares/isAuthenticated.middleware.js";
import validateMockPaymentsMiddleware from "../middlewares/validateMockPayments.middleware.js";

const paymentRoutes = Router();

paymentRoutes.post(
  "/mock/:result",
  isAuthenticatedMiddleware,
  validateMockPaymentsMiddleware,
  processMockPaymentsController,
);

export default paymentRoutes;
