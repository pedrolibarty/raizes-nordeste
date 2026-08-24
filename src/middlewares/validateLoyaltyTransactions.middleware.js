import { LOYALTY_TRANSACTION_TYPE_VALUES } from "../constants/loyalty-transaction-types.js";
import { AppError } from "../errors/appError.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateLoyaltyTransactionIdMiddleware = (req, res, next) => {
  if (!UUID_PATTERN.test(req.params.id)) {
    throw new AppError(
      "O identificador da transação de fidelidade deve ser um UUID válido.",
      400,
    );
  }

  return next();
};

export const validateCreateLoyaltyTransactionsMiddleware = (req, res, next) => {
  const allowedFields = [
    "loyaltyAccountId",
    "transactionType",
    "points",
    "description",
    "orderId",
  ];
  const body = req.body ?? {};
  const invalidFields = Object.keys(body).filter(
    (field) => !allowedFields.includes(field),
  );
  const errors = [];

  if (invalidFields.length) {
    errors.push(`Campos não permitidos: ${invalidFields.join(", ")}.`);
  }
  if (!UUID_PATTERN.test(body.loyaltyAccountId)) {
    errors.push("Conta de fidelidade deve possuir um UUID válido.");
  }
  if (!LOYALTY_TRANSACTION_TYPE_VALUES.includes(body.transactionType)) {
    errors.push(`Tipo deve ser ${LOYALTY_TRANSACTION_TYPE_VALUES.join(" ou ")}.`);
  }
  if (!Number.isInteger(body.points) || body.points <= 0) {
    errors.push("Pontos devem ser um inteiro maior que zero.");
  }
  if (
    body.orderId !== undefined &&
    body.orderId !== null &&
    !UUID_PATTERN.test(body.orderId)
  ) {
    errors.push("Pedido deve possuir um UUID válido.");
  }
  if (
    body.description !== undefined &&
    (typeof body.description !== "string" ||
      body.description.trim().length > 255)
  ) {
    errors.push("Descrição deve ser um texto de até 255 caracteres.");
  }

  if (errors.length) {
    throw new AppError(
      `Não foi possível validar a transação: ${errors.join(" ")}`,
      422,
    );
  }

  if (typeof body.description === "string") {
    body.description = body.description.trim() || null;
  }

  return next();
};
