import { AppError } from "../errors/appError.js";

const verifyUserRoleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError("É necessário estar autenticado para acessar esta rota.", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        "Seu nível de acesso não permite realizar esta operação.",
        403,
      );
    }

    return next();
  };
};

export default verifyUserRoleMiddleware;
