import { AppDataSource } from "../../data-source.js";
import buildOrderItemValuesService from "./helpers/buildOrderItemValues.service.js";
import recalculateOrderTotalsService from "./helpers/recalculateOrderTotals.service.js";
import retrieveOrderWithItemsService from "./helpers/retrieveOrderWithItems.service.js";
import verifyCanModifyOrderItemsService from "./helpers/verifyCanModifyOrderItems.service.js";
import verifyOrderStockAvailabilityService from "./helpers/verifyOrderStockAvailability.service.js";

const createOrderItemsService = async (orderId, data, authentication) => {
  return AppDataSource.transaction(async (transactionManager) => {
    const itemRepository = transactionManager.getRepository("OrderItem");
    const { foundOrder } = await retrieveOrderWithItemsService(
      transactionManager,
      orderId,
    );
    verifyCanModifyOrderItemsService(foundOrder, authentication);
    const itemValues = await buildOrderItemValuesService(
      transactionManager,
      foundOrder.branch.id,
      data,
    );
    const { points, ...orderItemValues } = itemValues;
    const createdItem = itemRepository.create({
      ...orderItemValues,
      order: foundOrder,
    });
    const savedItem = await itemRepository.save(createdItem);
    await verifyOrderStockAvailabilityService(transactionManager, orderId);
    const updatedOrder = await recalculateOrderTotalsService(
      transactionManager,
      foundOrder,
    );

    return { item: savedItem, order: updatedOrder };
  });
};

export default createOrderItemsService;
