import { AppError } from "../errors/appError.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const FIELD_RULES = {
  branchCode: { label: "Código da filial", required: true },
  name: { label: "Nome", required: true, maxLength: 100 },
  openingRules: { label: "Regras de funcionamento", required: true },
  street: { label: "Rua", required: true, maxLength: 150 },
  district: { label: "Bairro", required: true, maxLength: 100 },
  city: { label: "Cidade", required: true, maxLength: 100 },
  state: { label: "Estado", required: true },
  number: { label: "Número", required: true, maxLength: 20 },
};

const validateBody = (body, isUpdate) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new AppError("O corpo da requisição deve ser um objeto JSON.", 400);
  }

  const receivedFields = Object.keys(body);
  const invalidFields = receivedFields.filter((field) => !FIELD_RULES[field]);

  if (invalidFields.length) {
    throw new AppError(
      `Campos não permitidos: ${invalidFields.join(", ")}.`,
      422,
    );
  }

  if (isUpdate && receivedFields.length === 0) {
    throw new AppError("Informe ao menos um campo para atualizar a filial.", 422);
  }

  const errors = [];

  for (const [field, rule] of Object.entries(FIELD_RULES)) {
    const value = body[field];

    if (!isUpdate && rule.required && (value === undefined || value === null)) {
      errors.push(`${rule.label} é obrigatório.`);
      continue;
    }

    if (value === undefined) continue;

    if (field === "branchCode") {
      if (!Number.isInteger(value) || value <= 0) {
        errors.push("Código da filial deve ser um número inteiro maior que zero.");
      }
      continue;
    }

    if (field === "openingRules") {
      if (value === null || typeof value !== "object" || Array.isArray(value)) {
        errors.push("Regras de funcionamento devem ser um objeto JSON válido.");
      }
      continue;
    }

    if (typeof value !== "string" || !value.trim()) {
      errors.push(`${rule.label} deve ser um texto não vazio.`);
      continue;
    }

    body[field] = value.trim();

    if (rule.maxLength && body[field].length > rule.maxLength) {
      errors.push(`${rule.label} deve ter no máximo ${rule.maxLength} caracteres.`);
    }
  }

  if (body.state !== undefined) {
    body.state = typeof body.state === "string" ? body.state.toUpperCase() : body.state;

    if (typeof body.state !== "string" || !/^[A-Z]{2}$/.test(body.state)) {
      errors.push("Estado deve conter uma sigla válida com duas letras, como PE.");
    }
  }

  if (errors.length) {
    throw new AppError(
      `Não foi possível validar os dados da filial: ${errors.join(" ")}`,
      422,
    );
  }
};

export const validateBranchIdMiddleware = (req, res, next) => {
  if (!UUID_PATTERN.test(req.params.id)) {
    throw new AppError("O identificador da filial deve ser um UUID válido.", 400);
  }

  return next();
};

export const validateCreateBranchesMiddleware = (req, res, next) => {
  validateBody(req.body, false);
  return next();
};

export const validateUpdateBranchesMiddleware = (req, res, next) => {
  validateBody(req.body, true);
  return next();
};
