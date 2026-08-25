import { AppDataSource } from "../../data-source.js";
import { ORDER_ITEM_STATUSES } from "../../constants/order-item-statuses.js";
import { ORDER_STATUSES } from "../../constants/order-statuses.js";
import { USER_ROLES } from "../../constants/user-roles.js";
import { LOYALTY_TRANSACTION_TYPES } from "../../constants/loyalty-transaction-types.js";
import { MOVEMENT_TYPES } from "../../constants/movement-types.js";
import { AppError } from "../../errors/appError.js";
import createLoyaltyTransactionsService from "../loyalty/transactions/createLoyaltyTransactions.service.js";
import createMovementsService from "../movements/createMovements.service.js";
import retrieveOrderWithItemsService from "./helpers/retrieveOrderWithItems.service.js";

const hasRole = (authentication, allowedRoles) => {
  return authentication && allowedRoles.includes(authentication.actor.role);
};

const updateOrderStatusService = async (
  orderId,
  newStatus,
  authentication = null,
  providedManager = null,
) => {
  const execute = async (transactionManager) => {
    const orderRepository = transactionManager.getRepository("Order");
    const itemRepository = transactionManager.getRepository("OrderItem");
    const inventoryRepository = transactionManager.getRepository("Inventory");
    const accountRepository = transactionManager.getRepository("LoyaltyAccount");
    const lockedOrder = await orderRepository.findOne({
      where: { id: orderId },
      lock: { mode: "pessimistic_write" },
    });

    if (!lockedOrder) throw new AppError("Pedido não encontrado.", 404);

    const { foundOrder, orderItems } = await retrieveOrderWithItemsService(
      transactionManager,
      orderId,
    );
    const currentStatus = lockedOrder.status;

    if (
      currentStatus === ORDER_STATUSES.AWAITING_PAYMENT &&
      [ORDER_STATUSES.PAID, ORDER_STATUSES.PAYMENT_DECLINED].includes(newStatus)
    ) {
      if (authentication) {
        throw new AppError("A confirmação do pagamento é realizada somente pelo sistema.", 403);
      }

      if (newStatus === ORDER_STATUSES.PAID) {
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
              movementType: MOVEMENT_TYPES.EXIT,
              quantity: orderItem.quantity,
              notes: `Baixa automática após pagamento do pedido ${orderId}`,
            },
            null,
            transactionManager,
          );
        }
      }
    } else if (
      currentStatus === ORDER_STATUSES.PAID &&
      newStatus === ORDER_STATUSES.IN_PREPARATION
    ) {
      if (!hasRole(authentication, [USER_ROLES.KITCHEN, USER_ROLES.MANAGER, USER_ROLES.ADMIN])) {
        throw new AppError("Seu nível de acesso não permite iniciar a preparação.", 403);
      }
      if (authentication.actor.role !== USER_ROLES.ADMIN && authentication.actor.branch.id !== foundOrder.branch.id) {
        throw new AppError("O pedido pertence a outra filial.", 403);
      }
      for (const orderItem of orderItems) {
        orderItem.status = ORDER_ITEM_STATUSES.IN_PREPARATION;
        await itemRepository.save(orderItem);
      }
    } else if (
      currentStatus === ORDER_STATUSES.IN_PREPARATION &&
      newStatus === ORDER_STATUSES.READY
    ) {
      if (!hasRole(authentication, [USER_ROLES.KITCHEN, USER_ROLES.MANAGER, USER_ROLES.ADMIN])) {
        throw new AppError("Seu nível de acesso não permite finalizar a preparação.", 403);
      }
      if (authentication.actor.role !== USER_ROLES.ADMIN && authentication.actor.branch.id !== foundOrder.branch.id) {
        throw new AppError("O pedido pertence a outra filial.", 403);
      }

      for (const orderItem of orderItems) {
        orderItem.status = ORDER_ITEM_STATUSES.READY;
        await itemRepository.save(orderItem);
      }
    } else if (
      currentStatus === ORDER_STATUSES.READY &&
      newStatus === ORDER_STATUSES.DELIVERED
    ) {
      if (!hasRole(authentication, [USER_ROLES.ATTENDANT, USER_ROLES.MANAGER, USER_ROLES.ADMIN])) {
        throw new AppError("Seu nível de acesso não permite entregar o pedido.", 403);
      }
      if (authentication.actor.role !== USER_ROLES.ADMIN && authentication.actor.branch.id !== foundOrder.branch.id) {
        throw new AppError("O pedido pertence a outra filial.", 403);
      }

      if (foundOrder.client && foundOrder.points > 0) {
        const loyaltyAccount = await accountRepository.findOne({
          where: { client: { id: foundOrder.client.id } },
        });
        if (loyaltyAccount?.hasConsent) {
          await createLoyaltyTransactionsService(
            {
              loyaltyAccountId: loyaltyAccount.id,
              transactionType: LOYALTY_TRANSACTION_TYPES.ENTRY,
              points: foundOrder.points,
              orderId,
              description: `Pontos recebidos pelo pedido ${orderId}`,
            },
            null,
            transactionManager,
          );
        }
      }
    } else {
      if (
        currentStatus === ORDER_STATUSES.AWAITING_PAYMENT &&
        newStatus === ORDER_STATUSES.IN_PREPARATION
      ) {
        throw new AppError(
          "Não é possível colocar em preparação um pedido que ainda não teve o pagamento aprovado.",
          409,
        );
      }

      throw new AppError(
        `Não é permitido alterar o pedido do status ${currentStatus} para ${newStatus}.`,
        409,
      );
    }

    lockedOrder.status = newStatus;
    return orderRepository.save(lockedOrder);
  };

  return providedManager
    ? execute(providedManager)
    : AppDataSource.transaction(execute);
};

export default updateOrderStatusService;
