import { AUTH_ACTOR_TYPES } from "../../../constants/auth-actor-types.js";
import { USER_ROLES } from "../../../constants/user-roles.js";
import { AppError } from "../../../errors/appError.js";

const verifyOrderAccessService = (order, authentication) => {
  if (
    authentication.actorType === AUTH_ACTOR_TYPES.CLIENT &&
    order.client?.id === authentication.actorId
  ) {
    return;
  }

  if (authentication.actorType === AUTH_ACTOR_TYPES.USER) {
    if (authentication.actor.role === USER_ROLES.ADMIN) return;
    if (order.branch.id === authentication.actor.branch.id) return;
  }

  throw new AppError("Você não possui acesso a este pedido.", 403);
};

export default verifyOrderAccessService;
