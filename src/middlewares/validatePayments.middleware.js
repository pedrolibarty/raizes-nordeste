import { AppError } from "../errors/appError.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validatePaymentIdMiddleware = (req, res, next) => {
  if (!UUID_PATTERN.test(req.params.id)) {
    throw new AppError("O identificador do pagamento deve ser um UUID válido.", 400);
  }

  return next();
};

export default validatePaymentIdMiddleware;
