import { MOVEMENT_TYPE_VALUES } from "../constants/movement-types.js";
import { AppError } from "../errors/appError.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateMovementIdMiddleware = (req, res, next) => {
  if (!UUID_PATTERN.test(req.params.id)) {
    throw new AppError(
      "O identificador da movimentação deve ser um UUID válido.",
      400,
    );
  }

  return next();
};

export const validateCreateMovementsMiddleware = (req, res, next) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    throw new AppError("O corpo da requisição deve ser um objeto JSON.", 400);
  }

  const allowedFields = ["inventoryId", "movementType", "quantity", "notes"];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length) {
    throw new AppError(
      `Campos não permitidos: ${invalidFields.join(", ")}.`,
      422,
    );
  }

  const { inventoryId, movementType, quantity, notes } = req.body;
  const errors = [];

  if (!UUID_PATTERN.test(inventoryId)) {
    errors.push("O identificador do estoque deve ser um UUID válido.");
  }

  if (!MOVEMENT_TYPE_VALUES.includes(movementType)) {
    errors.push(`Tipo de movimentação deve ser ${MOVEMENT_TYPE_VALUES.join(" ou ")}.`);
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    errors.push("Quantidade deve ser um número inteiro maior que zero.");
  }

  if (typeof notes !== "string" || !notes.trim()) {
    errors.push("Observação é obrigatória e deve ser um texto não vazio.");
  } else if (notes.trim().length > 255) {
    errors.push("Observação deve ter no máximo 255 caracteres.");
  } else {
    req.body.notes = notes.trim();
  }

  if (errors.length) {
    throw new AppError(
      `Não foi possível validar os dados da movimentação: ${errors.join(" ")}`,
      422,
    );
  }

  return next();
};
