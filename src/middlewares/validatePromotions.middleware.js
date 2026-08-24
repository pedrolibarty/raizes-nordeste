import { AppError } from "../errors/appError.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const PROMOTION_FIELDS = [
  "productId",
  "description",
  "valDiscount",
  "extraPoints",
  "isActive",
];

const hasAtMostTwoDecimalPlaces = (value) => {
  return /^\d+(\.\d{1,2})?$/.test(String(value));
};

const validatePromotionBody = (body, isUpdate) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new AppError("O corpo da requisição deve ser um objeto JSON.", 400);
  }

  const receivedFields = Object.keys(body);
  const invalidFields = receivedFields.filter(
    (field) => !PROMOTION_FIELDS.includes(field),
  );
  const errors = [];

  if (invalidFields.length) {
    errors.push(`Campos não permitidos: ${invalidFields.join(", ")}.`);
  }

  if (isUpdate && receivedFields.length === 0) {
    errors.push("Informe ao menos um campo para atualizar a promoção.");
  }

  if (!isUpdate) {
    for (const field of ["productId", "description"]) {
      if (body[field] === undefined || body[field] === null) {
        errors.push(`O campo ${field} é obrigatório.`);
      }
    }
  }

  if (body.productId !== undefined && !UUID_PATTERN.test(body.productId)) {
    errors.push("O identificador do produto deve ser um UUID válido.");
  }

  if (body.description !== undefined) {
    if (typeof body.description !== "string" || !body.description.trim()) {
      errors.push("Descrição deve ser um texto não vazio.");
    } else if (body.description.trim().length > 255) {
      errors.push("Descrição deve ter no máximo 255 caracteres.");
    } else {
      body.description = body.description.trim();
    }
  }

  if (body.valDiscount !== undefined) {
    if (
      typeof body.valDiscount !== "number" ||
      !Number.isFinite(body.valDiscount) ||
      body.valDiscount < 0 ||
      body.valDiscount > 99999999.99 ||
      !hasAtMostTwoDecimalPlaces(body.valDiscount)
    ) {
      errors.push(
        "Desconto deve ser um número não negativo com no máximo duas casas decimais.",
      );
    }
  }

  if (
    body.extraPoints !== undefined &&
    (!Number.isInteger(body.extraPoints) || body.extraPoints < 0)
  ) {
    errors.push("Pontos extras devem ser um número inteiro não negativo.");
  }

  if (body.isActive !== undefined && typeof body.isActive !== "boolean") {
    errors.push("O campo isActive deve ser verdadeiro ou falso.");
  }

  if (errors.length) {
    throw new AppError(
      `Não foi possível validar os dados da promoção: ${errors.join(" ")}`,
      422,
    );
  }
};

export const validatePromotionIdMiddleware = (req, res, next) => {
  if (!UUID_PATTERN.test(req.params.id)) {
    throw new AppError("O identificador da promoção deve ser um UUID válido.", 400);
  }

  return next();
};

export const validateCreatePromotionsMiddleware = (req, res, next) => {
  validatePromotionBody(req.body, false);
  return next();
};

export const validateUpdatePromotionsMiddleware = (req, res, next) => {
  validatePromotionBody(req.body, true);
  return next();
};
