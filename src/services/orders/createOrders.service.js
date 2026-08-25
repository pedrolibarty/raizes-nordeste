import { AppDataSource } from "../../data-source.js";
import { AUTH_ACTOR_TYPES } from "../../constants/auth-actor-types.js";
import { ORDER_STATUSES } from "../../constants/order-statuses.js";
import { USER_ROLES } from "../../constants/user-roles.js";
import { AppError } from "../../errors/appError.js";
import buildOrderItemValuesService from "./helpers/buildOrderItemValues.service.js";
import recalculateOrderTotalsService from "./helpers/recalculateOrderTotals.service.js";
import verifyOrderStockAvailabilityService from "./helpers/verifyOrderStockAvailability.service.js";
import registerAuditLogsService from "../auditLogs/registerAuditLogs.service.js";

const createOrdersService = async (data, authentication) => {
  return AppDataSource.transaction(async (transactionManager) => {
    const orderRepository = transactionManager.getRepository("Order");
    const itemRepository = transactionManager.getRepository("OrderItem");
    const branchRepository = transactionManager.getRepository("Branch");
    const clientRepository = transactionManager.getRepository("Client");
    const foundBranch = await branchRepository.findOneBy({ id: data.branchId });

    if (!foundBranch) throw new AppError("Filial não encontrada.", 404);

    let orderClient = null;
    let orderUser = null;

    if (authentication.actorType === AUTH_ACTOR_TYPES.CLIENT) {
      if (data.clientId && data.clientId !== authentication.actorId) {
        throw new AppError("O cliente só pode criar pedidos para si mesmo.", 403);
      }
      orderClient = authentication.actor;
    } else {
      if (authentication.actor.role === USER_ROLES.KITCHEN) {
        throw new AppError("Usuários da cozinha não podem criar pedidos.", 403);
      }
      if (
        authentication.actor.role !== USER_ROLES.ADMIN &&
        authentication.actor.branch.id !== foundBranch.id
      ) {
        throw new AppError("Funcionários só podem criar pedidos para sua filial.", 403);
      }
      orderUser = authentication.actor;

      if (data.clientId) {
        orderClient = await clientRepository.findOneBy({ id: data.clientId });
        if (!orderClient) throw new AppError("Cliente não encontrado.", 404);
      }
    }

    const createdOrder = orderRepository.create({
      branch: foundBranch,
      client: orderClient,
      user: orderUser,
      orderChannel: data.orderChannel,
      status: ORDER_STATUSES.AWAITING_PAYMENT,
      valAmountOg: "0.00",
      valDiscount: "0.00",
      valAmount: "0.00",
      points: 0,
      cancelledAt: null,
    });
    const savedOrder = await orderRepository.save(createdOrder);
    const savedItems = [];

    for (const itemData of data.items) {
      const itemValues = await buildOrderItemValuesService(
        transactionManager,
        foundBranch.id,
        itemData,
      );
      const { points, ...orderItemValues } = itemValues;
      const createdItem = itemRepository.create({
        ...orderItemValues,
        order: savedOrder,
      });
      savedItems.push(await itemRepository.save(createdItem));
    }

    await verifyOrderStockAvailabilityService(
      transactionManager,
      savedOrder.id,
    );

    const updatedOrder = await recalculateOrderTotalsService(
      transactionManager,
      savedOrder,
    );
    await registerAuditLogsService(transactionManager, {
      authentication,
      action: "CREATE",
      entity: "Order",
      entityId: updatedOrder.id,
      branchId: foundBranch.id,
      newData: {
        status: updatedOrder.status,
        valAmount: updatedOrder.valAmount,
        itemCount: savedItems.length,
      },
    });
    return { ...updatedOrder, items: savedItems };
  });
};

export default createOrdersService;
