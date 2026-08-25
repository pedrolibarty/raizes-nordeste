import { randomUUID } from "node:crypto";
import { AppDataSource } from "../../data-source.js";
import { AUTH_ACTOR_TYPES } from "../../constants/auth-actor-types.js";
import { ORDER_STATUSES } from "../../constants/order-statuses.js";
import { PAYMENT_MOCK_RESULTS } from "../../constants/payment-mock-results.js";
import { PAYMENT_STATUSES } from "../../constants/payment-statuses.js";
import { USER_ROLES } from "../../constants/user-roles.js";
import { AppError } from "../../errors/appError.js";
import updateOrderStatusService from "../orders/updateOrderStatus.service.js";
import verifyOrderAccessService from "../orders/helpers/verifyOrderAccess.service.js";

const processMockPaymentsService = async (
  result,
  data,
  authentication,
) => {
  return AppDataSource.transaction(async (transactionManager) => {
    const orderRepository = transactionManager.getRepository("Order");
    const paymentRepository = transactionManager.getRepository("Payment");
    const lockedOrder = await orderRepository.findOne({
      where: { id: data.orderId },
      lock: { mode: "pessimistic_write" },
    });

    if (!lockedOrder) throw new AppError("Pedido não encontrado.", 404);
    const foundOrder = await orderRepository.findOne({
      where: { id: data.orderId },
      relations: { branch: true, client: true, user: true },
    });
    verifyOrderAccessService(foundOrder, authentication);

    if (
      authentication.actorType === AUTH_ACTOR_TYPES.USER &&
      authentication.actor.role === USER_ROLES.KITCHEN
    ) {
      throw new AppError("Usuários da cozinha não podem processar pagamentos.", 403);
    }

    if (lockedOrder.status !== ORDER_STATUSES.AWAITING_PAYMENT) {
      throw new AppError(
        "Somente pedidos aguardando pagamento podem ser processados.",
        409,
      );
    }

    const approvedPayment = await paymentRepository.findOne({
      where: {
        order: { id: foundOrder.id },
        status: PAYMENT_STATUSES.APPROVED,
      },
    });

    if (approvedPayment) {
      throw new AppError("Este pedido já possui um pagamento aprovado.", 409);
    }

    const paymentStatusByResult = {
      [PAYMENT_MOCK_RESULTS.APPROVED]: PAYMENT_STATUSES.APPROVED,
      [PAYMENT_MOCK_RESULTS.DECLINED]: PAYMENT_STATUSES.DECLINED,
      [PAYMENT_MOCK_RESULTS.ERROR]: PAYMENT_STATUSES.ERROR,
    };
    const failureReasonByResult = {
      [PAYMENT_MOCK_RESULTS.DECLINED]: "Pagamento recusado pelo mock.",
      [PAYMENT_MOCK_RESULTS.ERROR]: "Erro técnico simulado pelo mock.",
    };
    const paymentStatus = paymentStatusByResult[result];
    const createdPayment = paymentRepository.create({
      order: foundOrder,
      paymentMethod: data.paymentMethod,
      status: paymentStatus,
      valAmount: foundOrder.valAmount,
      externalTransactionId: `mock-${randomUUID()}`,
      requestPayload: {
        result,
        orderId: foundOrder.id,
        valAmount: foundOrder.valAmount,
      },
      responsePayload: {
        provider: "MOCK",
        result,
      },
      failureReason: failureReasonByResult[result] ?? null,
      paidAt: result === PAYMENT_MOCK_RESULTS.APPROVED ? new Date() : null,
    });
    const savedPayment = await paymentRepository.save(createdPayment);
    let updatedOrder = foundOrder;

    if (result === PAYMENT_MOCK_RESULTS.APPROVED) {
      updatedOrder = await updateOrderStatusService(
        foundOrder.id,
        ORDER_STATUSES.PAID,
        null,
        transactionManager,
      );
    }

    return {
      payment: savedPayment,
      order: updatedOrder,
      hasTechnicalError: result === PAYMENT_MOCK_RESULTS.ERROR,
    };
  });
};

export default processMockPaymentsService;
