import { USER_ROLES_VALUES } from "../constants/user-roles.js";
import { AppError } from "../errors/appError.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const USER_FIELDS = [
  "branchId",
  "name",
  "role",
  "email",
  "password",
  "isActive",
];

const validateUserBody = (body, isUpdate) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new AppError("O corpo da requisição deve ser um objeto JSON.", 400);
  }

  const receivedFields = Object.keys(body);
  const invalidFields = receivedFields.filter(
    (field) => !USER_FIELDS.includes(field),
  );

  if (invalidFields.length) {
    throw new AppError(
      `Campos não permitidos: ${invalidFields.join(", ")}.`,
      422,
    );
  }

  if (isUpdate && receivedFields.length === 0) {
    throw new AppError("Informe ao menos um campo para atualizar o usuário.", 422);
  }

  const requiredFields = ["branchId", "name", "role", "email", "password"];
  const errors = [];

  if (!isUpdate) {
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        errors.push(`O campo ${field} é obrigatório.`);
      }
    }
  }

  if (body.branchId !== undefined && !UUID_PATTERN.test(body.branchId)) {
    errors.push("O identificador da filial deve ser um UUID válido.");
  }

  if (body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim()) {
      errors.push("Nome deve ser um texto não vazio.");
    } else if (body.name.trim().length > 100) {
      errors.push("Nome deve ter no máximo 100 caracteres.");
    } else {
      body.name = body.name.trim();
    }
  }

  if (body.role !== undefined && !USER_ROLES_VALUES.includes(body.role)) {
    errors.push(`Papel deve ser um dos valores: ${USER_ROLES_VALUES.join(", ")}.`);
  }

  if (body.email !== undefined) {
    if (
      typeof body.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
    ) {
      errors.push("Informe um e-mail válido.");
    } else if (body.email.trim().length > 150) {
      errors.push("E-mail deve ter no máximo 150 caracteres.");
    } else {
      body.email = body.email.trim().toLowerCase();
    }
  }

  if (
    body.password !== undefined &&
    (typeof body.password !== "string" || body.password.length < 8)
  ) {
    errors.push("Senha deve ter no mínimo 8 caracteres.");
  }

  if (body.isActive !== undefined && typeof body.isActive !== "boolean") {
    errors.push("O campo isActive deve ser verdadeiro ou falso.");
  }

  if (errors.length) {
    throw new AppError(
      `Não foi possível validar os dados do usuário: ${errors.join(" ")}`,
      422,
    );
  }
};

export const validateUserIdMiddleware = (req, res, next) => {
  if (!UUID_PATTERN.test(req.params.id)) {
    throw new AppError("O identificador do usuário deve ser um UUID válido.", 400);
  }

  return next();
};

export const validateCreateUsersMiddleware = (req, res, next) => {
  validateUserBody(req.body, false);
  return next();
};

export const validateUpdateUsersMiddleware = (req, res, next) => {
  validateUserBody(req.body, true);
  return next();
};
