import { AUTH_ACTOR_TYPES } from "../../../constants/auth-actor-types.js";
import { ORDER_STATUSES } from "../../../constants/order-statuses.js";
import { USER_ROLES } from "../../../constants/user-roles.js";
import { AppError } from "../../../errors/appError.js";
import verifyOrderAccessService from "./verifyOrderAccess.service.js";

const verifyCanModifyOrderItemsService = (order, authentication) => {
  verifyOrderAccessService(order, authentication);

  if (order.status !== ORDER_STATUSES.AWAITING_PAYMENT) {
    throw new AppError(
      "Os itens só podem ser alterados enquanto o pedido aguarda pagamento.",
      409,
    );
  }

  if (
    authentication.actorType === AUTH_ACTOR_TYPES.USER &&
    ![
      USER_ROLES.ADMIN,
      USER_ROLES.MANAGER,
      USER_ROLES.ATTENDANT,
    ].includes(authentication.actor.role)
  ) {
    throw new AppError("Seu nível de acesso não permite alterar itens.", 403);
  }
};

export default verifyCanModifyOrderItemsService;
