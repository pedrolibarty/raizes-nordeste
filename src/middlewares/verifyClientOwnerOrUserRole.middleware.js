import { AUTH_ACTOR_TYPES } from "../constants/auth-actor-types.js";
import { AppError } from "../errors/appError.js";

const verifyClientOwnerOrUserRoleMiddleware = (...allowedUserRoles) => {
  return (req, res, next) => {
    if (!req.auth) {
      throw new AppError("É necessário estar autenticado para acessar esta rota.", 401);
    }

    const isClientOwner =
      req.auth.actorType === AUTH_ACTOR_TYPES.CLIENT &&
      req.auth.actorId === req.params.id;
    const hasAllowedUserRole =
      req.auth.actorType === AUTH_ACTOR_TYPES.USER &&
      allowedUserRoles.includes(req.user.role);

    if (!isClientOwner && !hasAllowedUserRole) {
      throw new AppError(
        "Você não possui permissão para acessar os dados deste cliente.",
        403,
      );
    }

    return next();
  };
};

export default verifyClientOwnerOrUserRoleMiddleware;
