import { AppError } from "../errors/appError.js";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validateAuditLogIdMiddleware = (req, res, next) => {
  if (!UUID_PATTERN.test(req.params.id)) {
    throw new AppError("O identificador do registro de auditoria deve ser um UUID válido.", 400);
  }
  return next();
};

export default validateAuditLogIdMiddleware;
