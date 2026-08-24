import { AppError } from "../errors/appError.js";

const DATABASE_ERRORS = {
  23503: {
    statusCode: 409,
    message:
      "Não foi possível concluir a operação porque o registro está sendo utilizado por outros dados.",
  },
  23505: {
    statusCode: 409,
    message: "Já existe um registro com os dados únicos informados.",
  },
  23514: {
    statusCode: 422,
    message: "Os dados informados não atendem às regras de validação.",
  },
  "22P02": {
    statusCode: 400,
    message: "Um dos valores informados possui formato inválido.",
  },
};

const handleErrorMiddleware = (error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      message: "O corpo da requisição contém um JSON inválido.",
    });
  }

  if (error.constraint === "uq_promotions_active_product") {
    return res.status(409).json({
      message: "Este produto já possui uma promoção ativa.",
    });
  }

  const databaseError = DATABASE_ERRORS[error.code];

  if (databaseError) {
    return res.status(databaseError.statusCode).json({
      message: databaseError.message,
    });
  }

  console.error("Erro interno não tratado:", error);

  return res.status(500).json({
    message: "Ocorreu um erro interno. Tente novamente mais tarde.",
  });
};

export default handleErrorMiddleware;
