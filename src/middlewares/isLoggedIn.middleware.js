import { AppError } from "../errors/appError.js";
import isAuthenticatedMiddleware from "./isAuthenticated.middleware.js";

const isLoggedInMiddleware = async (req, res, next) => {
  await isAuthenticatedMiddleware(req, res, () => undefined);

  if (!req.user) {
    throw new AppError(
      "Esta rota é exclusiva para funcionários autenticados.",
      403,
    );
  }

  return next();
};

export default isLoggedInMiddleware;
