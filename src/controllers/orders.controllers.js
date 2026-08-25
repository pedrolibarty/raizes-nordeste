import cancelOrdersService from "../services/orders/cancelOrders.service.js";
import createOrderItemsService from "../services/orders/createOrderItems.service.js";
import createOrdersService from "../services/orders/createOrders.service.js";
import deleteOrderItemsService from "../services/orders/deleteOrderItems.service.js";
import listOrdersService from "../services/orders/listOrders.service.js";
import retrieveOrdersService from "../services/orders/retrieveOrders.service.js";
import updateOrderItemsService from "../services/orders/updateOrderItems.service.js";
import updateOrderStatusService from "../services/orders/updateOrderStatus.service.js";

export const createOrdersController = async (req, res) => {
  const createdOrder = await createOrdersService(req.body, req.auth);
  return res.status(201).json({ data: createdOrder });
};

export const listOrdersController = async (req, res) => {
  const orders = await listOrdersService(req.auth);
  return res.status(200).json({ data: orders });
};

export const retrieveOrdersController = async (req, res) => {
  const foundOrder = await retrieveOrdersService(req.params.id, req.auth);
  return res.status(200).json({ data: foundOrder });
};

export const updateOrderStatusController = async (req, res) => {
  const updatedOrder = await updateOrderStatusService(
    req.params.id,
    req.body.status,
    req.auth,
  );
  return res.status(200).json({ data: updatedOrder });
};

export const cancelOrdersController = async (req, res) => {
  const cancelledOrder = await cancelOrdersService(req.params.id, req.auth);
  return res.status(200).json({ data: cancelledOrder });
};

export const createOrderItemsController = async (req, res) => {
  const createdItem = await createOrderItemsService(
    req.params.orderId,
    req.body,
    req.auth,
  );
  return res.status(201).json({ data: createdItem });
};

export const updateOrderItemsController = async (req, res) => {
  const updatedItem = await updateOrderItemsService(
    req.params.orderId,
    req.params.itemId,
    req.body,
    req.auth,
  );
  return res.status(200).json({ data: updatedItem });
};

export const deleteOrderItemsController = async (req, res) => {
  const updatedOrder = await deleteOrderItemsService(
    req.params.orderId,
    req.params.itemId,
    req.auth,
  );
  return res.status(200).json({ data: updatedOrder });
};
