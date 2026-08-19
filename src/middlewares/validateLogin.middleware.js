import { AppError } from "../errors/appError.js";

const validateLoginMiddleware = (req, res, next) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    throw new AppError("O corpo da requisição deve ser um objeto JSON.", 400);
  }

  const allowedFields = ["email", "password"];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length) {
    throw new AppError(
      `Campos não permitidos: ${invalidFields.join(", ")}.`,
      422,
    );
  }

  const { email, password } = req.body;
  const errors = [];

  if (typeof email !== "string" || !email.trim()) {
    errors.push("E-mail é obrigatório.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push("Informe um e-mail válido.");
  }

  if (typeof password !== "string" || !password) {
    errors.push("Senha é obrigatória.");
  }

  if (errors.length) {
    throw new AppError(
      `Não foi possível validar os dados de login: ${errors.join(" ")}`,
      422,
    );
  }

  req.body.email = email.trim().toLowerCase();
  return next();
};

export default validateLoginMiddleware;
