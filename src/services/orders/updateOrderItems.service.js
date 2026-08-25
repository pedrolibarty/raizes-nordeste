import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";
import buildOrderItemValuesService from "./helpers/buildOrderItemValues.service.js";
import recalculateOrderTotalsService from "./helpers/recalculateOrderTotals.service.js";
import retrieveOrderWithItemsService from "./helpers/retrieveOrderWithItems.service.js";
import verifyCanModifyOrderItemsService from "./helpers/verifyCanModifyOrderItems.service.js";
import verifyOrderStockAvailabilityService from "./helpers/verifyOrderStockAvailability.service.js";

const updateOrderItemsService = async (
  orderId,
  itemId,
  data,
  authentication,
) => {
  return AppDataSource.transaction(async (transactionManager) => {
    const itemRepository = transactionManager.getRepository("OrderItem");
    const { foundOrder } = await retrieveOrderWithItemsService(
      transactionManager,
      orderId,
    );
    verifyCanModifyOrderItemsService(foundOrder, authentication);
    const foundItem = await itemRepository.findOne({
      where: { id: itemId, order: { id: orderId } },
      relations: { product: true },
    });

    if (!foundItem) throw new AppError("Item do pedido não encontrado.", 404);

    const itemValues = await buildOrderItemValuesService(
      transactionManager,
      foundOrder.branch.id,
      {
        productId: data.productId ?? foundItem.product.id,
        quantity: data.quantity ?? foundItem.quantity,
        notes: data.notes !== undefined ? data.notes : foundItem.notes,
      },
    );
    const { points, ...orderItemValues } = itemValues;
    itemRepository.merge(foundItem, orderItemValues);
    const updatedItem = await itemRepository.save(foundItem);
    await verifyOrderStockAvailabilityService(transactionManager, orderId);
    const updatedOrder = await recalculateOrderTotalsService(
      transactionManager,
      foundOrder,
    );

    return { item: updatedItem, order: updatedOrder };
  });
};

export default updateOrderItemsService;
