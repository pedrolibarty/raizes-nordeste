import { Router } from "express";
import {
  cancelOrdersController,
  createOrderItemsController,
  createOrdersController,
  deleteOrderItemsController,
  listOrdersController,
  retrieveOrdersController,
  updateOrderItemsController,
  updateOrderStatusController,
} from "../controllers/orders.controllers.js";
import isAuthenticatedMiddleware from "../middlewares/isAuthenticated.middleware.js";
import isLoggedInMiddleware from "../middlewares/isLoggedIn.middleware.js";
import {
  validateCreateOrderItemsMiddleware,
  validateCreateOrdersMiddleware,
  validateOrderIdMiddleware,
  validateOrderItemIdMiddleware,
  validateUpdateOrderItemsMiddleware,
  validateUpdateOrderStatusMiddleware,
} from "../middlewares/validateOrders.middleware.js";

const orderRoutes = Router();

orderRoutes.post(
  "/",
  isAuthenticatedMiddleware,
  validateCreateOrdersMiddleware,
  createOrdersController,
);
orderRoutes.get("/", isAuthenticatedMiddleware, listOrdersController);
orderRoutes.get(
  "/:id",
  validateOrderIdMiddleware,
  isAuthenticatedMiddleware,
  retrieveOrdersController,
);
orderRoutes.patch(
  "/:id/status",
  validateOrderIdMiddleware,
  isLoggedInMiddleware,
  validateUpdateOrderStatusMiddleware,
  updateOrderStatusController,
);
orderRoutes.patch(
  "/:id/cancel",
  validateOrderIdMiddleware,
  isAuthenticatedMiddleware,
  cancelOrdersController,
);
orderRoutes.post(
  "/:orderId/items",
  validateOrderIdMiddleware,
  isAuthenticatedMiddleware,
  validateCreateOrderItemsMiddleware,
  createOrderItemsController,
);
orderRoutes.patch(
  "/:orderId/items/:itemId",
  validateOrderIdMiddleware,
  validateOrderItemIdMiddleware,
  isAuthenticatedMiddleware,
  validateUpdateOrderItemsMiddleware,
  updateOrderItemsController,
);
orderRoutes.delete(
  "/:orderId/items/:itemId",
  validateOrderIdMiddleware,
  validateOrderItemIdMiddleware,
  isAuthenticatedMiddleware,
  deleteOrderItemsController,
);

export default orderRoutes;
