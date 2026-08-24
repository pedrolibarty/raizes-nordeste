import { AppDataSource } from "../../../data-source.js";
import { AUTH_ACTOR_TYPES } from "../../../constants/auth-actor-types.js";
import {
  LOYALTY_TRANSACTION_TYPES,
  LOYALTY_TRANSACTION_TYPE_VALUES,
} from "../../../constants/loyalty-transaction-types.js";
import { AppError } from "../../../errors/appError.js";

const createLoyaltyTransactionsService = async (data, authentication = null, providedManager = null) => {
  if (!LOYALTY_TRANSACTION_TYPE_VALUES.includes(data.transactionType) || !Number.isInteger(data.points) || data.points <= 0) {
    throw new AppError("Tipo ou quantidade de pontos inválidos.", 422);
  }

  const execute = async (transactionManager) => {
    const accountRepository = transactionManager.getRepository("LoyaltyAccount");
    const transactionRepository = transactionManager.getRepository("LoyaltyTransaction");
    const orderRepository = transactionManager.getRepository("Order");
    const foundAccount = await accountRepository.findOne({ where: { id: data.loyaltyAccountId }, lock: { mode: "pessimistic_write" } });
    if (!foundAccount) throw new AppError("Conta de fidelidade não encontrada.", 404);
    if (!foundAccount.hasConsent) throw new AppError("O cliente não autorizou a participação no programa de fidelidade.", 403);
    const accountWithClient = await accountRepository.findOne({ where: { id: data.loyaltyAccountId }, relations: { client: true } });
    const accountClientId = accountWithClient.client.id;

    if (authentication) {
      const canRedeem = authentication.actorType === AUTH_ACTOR_TYPES.CLIENT && authentication.actorId === accountClientId && data.transactionType === LOYALTY_TRANSACTION_TYPES.EXIT;
      if (!canRedeem) throw new AppError("Clientes só podem realizar saídas de pontos da própria conta.", 403);
    } else if (data.transactionType !== LOYALTY_TRANSACTION_TYPES.ENTRY || !data.orderId) {
      throw new AppError("Entradas automáticas devem estar vinculadas a um pedido.", 422);
    }

    let foundOrder = null;
    if (data.orderId) {
      foundOrder = await orderRepository.findOne({ where: { id: data.orderId }, relations: { client: true } });
      if (!foundOrder) throw new AppError("Pedido não encontrado.", 404);
      if (foundOrder.client?.id !== accountClientId) throw new AppError("O pedido não pertence ao cliente desta conta de fidelidade.", 422);
    }

    const pointsBalance = data.transactionType === LOYALTY_TRANSACTION_TYPES.ENTRY
      ? foundAccount.pointsBalance + data.points
      : foundAccount.pointsBalance - data.points;
    if (pointsBalance < 0) throw new AppError(`Saldo de pontos insuficiente. Saldo disponível: ${foundAccount.pointsBalance}.`, 409);

    foundAccount.pointsBalance = pointsBalance;
    await accountRepository.save(foundAccount);
    const createdTransaction = transactionRepository.create({
      loyaltyAccount: foundAccount,
      order: foundOrder,
      transactionType: data.transactionType,
      description: data.description ?? null,
      points: data.points,
    });
    const savedTransaction = await transactionRepository.save(createdTransaction);
    return { ...savedTransaction, pointsBalance };
  };

  return providedManager ? execute(providedManager) : AppDataSource.transaction(execute);
};

export default createLoyaltyTransactionsService;
