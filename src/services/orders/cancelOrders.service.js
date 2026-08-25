import { AppDataSource } from "../../data-source.js";
import { AUTH_ACTOR_TYPES } from "../../constants/auth-actor-types.js";
import { ORDER_ITEM_STATUSES } from "../../constants/order-item-statuses.js";
import { ORDER_STATUSES } from "../../constants/order-statuses.js";
import { MOVEMENT_TYPES } from "../../constants/movement-types.js";
import { USER_ROLES } from "../../constants/user-roles.js";
import { AppError } from "../../errors/appError.js";
import createMovementsService from "../movements/createMovements.service.js";
import retrieveOrderWithItemsService from "./helpers/retrieveOrderWithItems.service.js";
import verifyOrderAccessService from "./helpers/verifyOrderAccess.service.js";
import registerAuditLogsService from "../auditLogs/registerAuditLogs.service.js";

const cancelOrdersService = async (orderId, authentication = null) => {
  return AppDataSource.transaction(async (transactionManager) => {
    const orderRepository = transactionManager.getRepository("Order");
    const itemRepository = transactionManager.getRepository("OrderItem");
    const inventoryRepository = transactionManager.getRepository("Inventory");
    const lockedOrder = await orderRepository.findOne({
      where: { id: orderId },
      lock: { mode: "pessimistic_write" },
    });
    if (!lockedOrder) throw new AppError("Pedido não encontrado.", 404);

    const { foundOrder, orderItems } = await retrieveOrderWithItemsService(
      transactionManager,
      orderId,
    );

    if (authentication) verifyOrderAccessService(foundOrder, authentication);

    const isAwaitingPayment = lockedOrder.status === ORDER_STATUSES.AWAITING_PAYMENT;
    let canCancel = !authentication && isAwaitingPayment;

    if (authentication?.actorType === AUTH_ACTOR_TYPES.CLIENT) {
      canCancel = isAwaitingPayment;
    } else if (authentication?.actorType === AUTH_ACTOR_TYPES.USER) {
      const role = authentication.actor.role;
      if (role === USER_ROLES.ADMIN) canCancel = [ORDER_STATUSES.AWAITING_PAYMENT, ORDER_STATUSES.PAID, ORDER_STATUSES.IN_PREPARATION].includes(lockedOrder.status);
      if (role === USER_ROLES.MANAGER) canCancel = [ORDER_STATUSES.AWAITING_PAYMENT, ORDER_STATUSES.PAID, ORDER_STATUSES.IN_PREPARATION].includes(lockedOrder.status);
      if (role === USER_ROLES.ATTENDANT) canCancel = isAwaitingPayment;
    }

    if (!canCancel) throw new AppError("Este pedido não pode ser cancelado pelo usuário ou no status atual.", 403);

    if (
      [ORDER_STATUSES.PAID, ORDER_STATUSES.IN_PREPARATION].includes(
        lockedOrder.status,
      )
    ) {
      for (const orderItem of orderItems) {
        const foundInventory = await inventoryRepository.findOne({
          where: { product: { id: orderItem.product.id } },
        });

        if (!foundInventory) {
          throw new AppError(
            `Estoque do produto ${orderItem.product.name} não encontrado.`,
            404,
          );
        }

        await createMovementsService(
          {
            inventoryId: foundInventory.id,
            movementType: MOVEMENT_TYPES.ENTRY,
            quantity: orderItem.quantity,
            notes: `Estorno automático do pedido cancelado ${orderId}`,
          },
          authentication?.actor ?? null,
          transactionManager,
        );
      }
    }

    const cancelledAt = new Date();
    const previousStatus = lockedOrder.status;
    lockedOrder.status = ORDER_STATUSES.CANCELLED;
    lockedOrder.cancelledAt = cancelledAt;
    for (const orderItem of orderItems) {
      orderItem.status = ORDER_ITEM_STATUSES.CANCELLED;
      orderItem.cancelledAt = cancelledAt;
      await itemRepository.save(orderItem);
    }
    const cancelledOrder = await orderRepository.save(lockedOrder);
    await registerAuditLogsService(transactionManager, {
      authentication,
      action: "CANCEL",
      entity: "Order",
      entityId: cancelledOrder.id,
      branchId: foundOrder.branch.id,
      oldData: { status: previousStatus },
      newData: { status: ORDER_STATUSES.CANCELLED },
    });
    return cancelledOrder;
  });
};

export default cancelOrdersService;
