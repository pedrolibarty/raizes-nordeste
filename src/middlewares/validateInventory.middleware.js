import { AppError } from "../errors/appError.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateInventoryIdMiddleware = (req, res, next) => {
  if (!UUID_PATTERN.test(req.params.id)) {
    throw new AppError("O identificador do estoque deve ser um UUID válido.", 400);
  }

  return next();
};

export const validateInventoryProductIdMiddleware = (req, res, next) => {
  if (!UUID_PATTERN.test(req.params.productId)) {
    throw new AppError("O identificador do produto deve ser um UUID válido.", 400);
  }

  return next();
};

export const validateInventoryBranchIdMiddleware = (req, res, next) => {
  if (!UUID_PATTERN.test(req.params.branchId)) {
    throw new AppError("O identificador da filial deve ser um UUID válido.", 400);
  }

  return next();
};
