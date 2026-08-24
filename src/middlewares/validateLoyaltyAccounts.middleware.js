import { AppError } from "../errors/appError.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateLoyaltyAccountIdMiddleware = (req, res, next) => {
  if (!UUID_PATTERN.test(req.params.id)) {
    throw new AppError(
      "O identificador da conta de fidelidade deve ser um UUID válido.",
      400,
    );
  }

  return next();
};

export const validateCreateLoyaltyAccountsMiddleware = (req, res, next) => {
  const { clientId, hasConsent = false } = req.body ?? {};
  const allowedFields = ["clientId", "hasConsent"];
  const invalidFields = Object.keys(req.body ?? {}).filter(
    (field) => !allowedFields.includes(field),
  );

  if (!req.body || invalidFields.length) {
    throw new AppError("Informe somente clientId e hasConsent.", 422);
  }

  if (!UUID_PATTERN.test(clientId)) {
    throw new AppError("O identificador do cliente deve ser um UUID válido.", 400);
  }

  if (typeof hasConsent !== "boolean") {
    throw new AppError("O campo hasConsent deve ser verdadeiro ou falso.", 422);
  }

  return next();
};

export const validateUpdateLoyaltyAccountsMiddleware = (req, res, next) => {
  if (
    Object.keys(req.body ?? {}).length !== 1 ||
    typeof req.body.hasConsent !== "boolean"
  ) {
    throw new AppError(
      "Informe apenas hasConsent como verdadeiro ou falso.",
      422,
    );
  }

  return next();
};
