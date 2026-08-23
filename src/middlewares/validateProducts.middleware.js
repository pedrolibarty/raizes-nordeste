import { AppError } from "../errors/appError.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const PRODUCT_FIELDS = [
  "productCode",
  "branchId",
  "name",
  "category",
  "isAvailable",
  "isActive",
  "price",
];

const hasAtMostTwoDecimalPlaces = (value) => {
  return /^\d+(\.\d{1,2})?$/.test(String(value));
};

const validateProductBody = (body, isUpdate) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new AppError("O corpo da requisição deve ser um objeto JSON.", 400);
  }

  const receivedFields = Object.keys(body);
  const invalidFields = receivedFields.filter(
    (field) => !PRODUCT_FIELDS.includes(field),
  );

  if (invalidFields.length) {
    throw new AppError(
      `Campos não permitidos: ${invalidFields.join(", ")}.`,
      422,
    );
  }

  if (isUpdate && receivedFields.length === 0) {
    throw new AppError("Informe ao menos um campo para atualizar o produto.", 422);
  }

  const requiredFields = ["productCode", "branchId", "name", "category", "price"];
  const errors = [];

  if (!isUpdate) {
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        errors.push(`O campo ${field} é obrigatório.`);
      }
    }
  }

  if (
    body.productCode !== undefined &&
    (!Number.isInteger(body.productCode) || body.productCode <= 0)
  ) {
    errors.push("Código do produto deve ser um número inteiro maior que zero.");
  }

  if (body.branchId !== undefined && !UUID_PATTERN.test(body.branchId)) {
    errors.push("O identificador da filial deve ser um UUID válido.");
  }

  const textFields = [
    { field: "name", label: "Nome", maxLength: 100 },
    { field: "category", label: "Categoria", maxLength: 30 },
  ];

  for (const { field, label, maxLength } of textFields) {
    if (body[field] === undefined) continue;

    if (typeof body[field] !== "string" || !body[field].trim()) {
      errors.push(`${label} deve ser um texto não vazio.`);
    } else if (body[field].trim().length > maxLength) {
      errors.push(`${label} deve ter no máximo ${maxLength} caracteres.`);
    } else {
      body[field] = body[field].trim();
    }
  }

  if (body.price !== undefined) {
    if (
      typeof body.price !== "number" ||
      !Number.isFinite(body.price) ||
      body.price < 0 ||
      body.price > 99999999.99 ||
      !hasAtMostTwoDecimalPlaces(body.price)
    ) {
      errors.push(
        "Preço deve ser um número entre 0 e 99999999.99, com no máximo duas casas decimais.",
      );
    }
  }

  for (const field of ["isAvailable", "isActive"]) {
    if (body[field] !== undefined && typeof body[field] !== "boolean") {
      errors.push(`O campo ${field} deve ser verdadeiro ou falso.`);
    }
  }

  if (errors.length) {
    throw new AppError(
      `Não foi possível validar os dados do produto: ${errors.join(" ")}`,
      422,
    );
  }
};

export const validateProductIdMiddleware = (req, res, next) => {
  if (!UUID_PATTERN.test(req.params.id)) {
    throw new AppError("O identificador do produto deve ser um UUID válido.", 400);
  }

  return next();
};

export const validateProductBranchIdMiddleware = (req, res, next) => {
  if (!UUID_PATTERN.test(req.params.branchId)) {
    throw new AppError("O identificador da filial deve ser um UUID válido.", 400);
  }

  return next();
};

export const validateCreateProductsMiddleware = (req, res, next) => {
  validateProductBody(req.body, false);
  return next();
};

export const validateUpdateProductsMiddleware = (req, res, next) => {
  validateProductBody(req.body, true);
  return next();
};
