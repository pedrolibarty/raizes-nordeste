import { AppError } from "../errors/appError.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const CLIENT_FIELDS = [
  "name",
  "cpf",
  "contact",
  "email",
  "password",
  "street",
  "district",
  "city",
  "state",
  "number",
];

const isValidCpf = (cpf) => {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;

  const calculateDigit = (length) => {
    let sum = 0;

    for (let index = 0; index < length; index += 1) {
      sum += Number(cpf[index]) * (length + 1 - index);
    }

    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return (
    calculateDigit(9) === Number(cpf[9]) &&
    calculateDigit(10) === Number(cpf[10])
  );
};

const validateClientsBody = (body, isUpdate) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new AppError("O corpo da requisição deve ser um objeto JSON.", 400);
  }

  const receivedFields = Object.keys(body);
  const invalidFields = receivedFields.filter(
    (field) => !CLIENT_FIELDS.includes(field),
  );

  if (invalidFields.length) {
    throw new AppError(
      `Campos não permitidos: ${invalidFields.join(", ")}.`,
      422,
    );
  }

  if (isUpdate && receivedFields.length === 0) {
    throw new AppError(
      "Informe ao menos um campo para atualizar o cliente.",
      422,
    );
  }

  const errors = [];

  if (!isUpdate) {
    for (const field of CLIENT_FIELDS) {
      if (body[field] === undefined || body[field] === null) {
        errors.push(`O campo ${field} é obrigatório.`);
      }
    }
  }

  const textFields = [
    { field: "name", label: "Nome", maxLength: 100 },
    { field: "contact", label: "Contato", maxLength: 20 },
    { field: "street", label: "Rua", maxLength: 150 },
    { field: "district", label: "Bairro", maxLength: 100 },
    { field: "city", label: "Cidade", maxLength: 100 },
    { field: "number", label: "Número", maxLength: 20 },
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

  if (body.cpf !== undefined) {
    if (typeof body.cpf !== "string" || !isValidCpf(body.cpf.trim())) {
      errors.push("Informe um CPF válido contendo somente os 11 números.");
    } else {
      body.cpf = body.cpf.trim();
    }
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

  if (body.state !== undefined) {
    body.state =
      typeof body.state === "string"
        ? body.state.trim().toUpperCase()
        : body.state;

    if (typeof body.state !== "string" || !/^[A-Z]{2}$/.test(body.state)) {
      errors.push(
        "Estado deve conter uma sigla válida com duas letras, como PE.",
      );
    }
  }

  if (errors.length) {
    throw new AppError(
      `Não foi possível validar os dados do cliente: ${errors.join(" ")}`,
      422,
    );
  }
};

export const validateClientIdMiddleware = (req, res, next) => {
  if (!UUID_PATTERN.test(req.params.id)) {
    throw new AppError(
      "O identificador do cliente deve ser um UUID válido.",
      400,
    );
  }

  return next();
};

export const validateCreateClientsMiddleware = (req, res, next) => {
  validateClientsBody(req.body, false);
  return next();
};

export const validateUpdateClientsMiddleware = (req, res, next) => {
  validateClientsBody(req.body, true);
  return next();
};
