import { ORDER_CHANNEL_VALUES } from "../constants/order-channels.js";
import { ORDER_STATUS_VALUES } from "../constants/order-statuses.js";
import { AppError } from "../errors/appError.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validateOrderItem = (item, index) => {
  const errors = [];
  const invalidFields = Object.keys(item ?? {}).filter(
    (field) => !["productId", "quantity", "notes"].includes(field),
  );

  if (!item || typeof item !== "object" || Array.isArray(item)) {
    return [`Item ${index + 1} deve ser um objeto.`];
  }
  if (invalidFields.length) errors.push(`Item ${index + 1} possui campos não permitidos: ${invalidFields.join(", ")}.`);
  if (!UUID_PATTERN.test(item.productId)) errors.push(`Produto do item ${index + 1} deve possuir um UUID válido.`);
  if (!Number.isInteger(item.quantity) || item.quantity <= 0) errors.push(`Quantidade do item ${index + 1} deve ser um inteiro maior que zero.`);
  if (item.notes !== undefined && item.notes !== null && typeof item.notes !== "string") errors.push(`Observação do item ${index + 1} deve ser um texto.`);
  if (typeof item.notes === "string") item.notes = item.notes.trim() || null;
  return errors;
};

export const validateOrderIdMiddleware = (req, res, next) => {
  if (!UUID_PATTERN.test(req.params.id ?? req.params.orderId)) {
    throw new AppError("O identificador do pedido deve ser um UUID válido.", 400);
  }
  return next();
};

export const validateOrderItemIdMiddleware = (req, res, next) => {
  if (!UUID_PATTERN.test(req.params.itemId)) {
    throw new AppError("O identificador do item deve ser um UUID válido.", 400);
  }
  return next();
};

export const validateCreateOrdersMiddleware = (req, res, next) => {
  const body = req.body ?? {};
  const invalidFields = Object.keys(body).filter(
    (field) => !["branchId", "clientId", "orderChannel", "items"].includes(field),
  );
  const errors = [];

  if (invalidFields.length) errors.push(`Campos não permitidos: ${invalidFields.join(", ")}.`);
  if (!UUID_PATTERN.test(body.branchId)) errors.push("Filial deve possuir um UUID válido.");
  if (body.clientId !== undefined && body.clientId !== null && !UUID_PATTERN.test(body.clientId)) errors.push("Cliente deve possuir um UUID válido.");
  if (!ORDER_CHANNEL_VALUES.includes(body.orderChannel)) errors.push(`Canal deve ser: ${ORDER_CHANNEL_VALUES.join(", ")}.`);
  if (!Array.isArray(body.items) || body.items.length === 0) errors.push("O pedido deve possuir ao menos um item.");
  else body.items.forEach((item, index) => errors.push(...validateOrderItem(item, index)));

  if (errors.length) throw new AppError(`Não foi possível validar o pedido: ${errors.join(" ")}`, 422);
  return next();
};

export const validateCreateOrderItemsMiddleware = (req, res, next) => {
  const errors = validateOrderItem(req.body, 0);
  if (errors.length) throw new AppError(`Não foi possível validar o item: ${errors.join(" ")}`, 422);
  return next();
};

export const validateUpdateOrderItemsMiddleware = (req, res, next) => {
  const body = req.body ?? {};
  const invalidFields = Object.keys(body).filter(
    (field) => !["productId", "quantity", "notes"].includes(field),
  );
  if (!Object.keys(body).length || invalidFields.length) {
    throw new AppError("Informe productId, quantity ou notes para atualizar o item.", 422);
  }
  if (body.productId !== undefined && !UUID_PATTERN.test(body.productId)) throw new AppError("Produto deve possuir um UUID válido.", 422);
  if (body.quantity !== undefined && (!Number.isInteger(body.quantity) || body.quantity <= 0)) throw new AppError("Quantidade deve ser um inteiro maior que zero.", 422);
  if (body.notes !== undefined && body.notes !== null && typeof body.notes !== "string") throw new AppError("Observação deve ser um texto.", 422);
  if (typeof body.notes === "string") body.notes = body.notes.trim() || null;
  return next();
};

export const validateUpdateOrderStatusMiddleware = (req, res, next) => {
  if (Object.keys(req.body ?? {}).length !== 1 || !ORDER_STATUS_VALUES.includes(req.body.status)) {
    throw new AppError(`Informe apenas um status válido: ${ORDER_STATUS_VALUES.join(", ")}.`, 422);
  }
  return next();
};
