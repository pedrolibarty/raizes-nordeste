import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";
import recalculateOrderTotalsService from "./helpers/recalculateOrderTotals.service.js";
import retrieveOrderWithItemsService from "./helpers/retrieveOrderWithItems.service.js";
import verifyCanModifyOrderItemsService from "./helpers/verifyCanModifyOrderItems.service.js";

const deleteOrderItemsService = async (orderId, itemId, authentication) => {
  return AppDataSource.transaction(async (transactionManager) => {
    const itemRepository = transactionManager.getRepository("OrderItem");
    const { foundOrder, orderItems } = await retrieveOrderWithItemsService(
      transactionManager,
      orderId,
    );
    verifyCanModifyOrderItemsService(foundOrder, authentication);
    const foundItem = orderItems.find((orderItem) => orderItem.id === itemId);

    if (!foundItem) throw new AppError("Item do pedido não encontrado.", 404);
    if (orderItems.length === 1) {
      throw new AppError("O pedido deve possuir ao menos um item.", 409);
    }

    await itemRepository.remove(foundItem);
    return recalculateOrderTotalsService(transactionManager, foundOrder);
  });
};

export default deleteOrderItemsService;
