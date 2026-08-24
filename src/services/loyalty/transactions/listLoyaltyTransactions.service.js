import { AppDataSource } from "../../../data-source.js";
import { AUTH_ACTOR_TYPES } from "../../../constants/auth-actor-types.js";
import { USER_ROLES } from "../../../constants/user-roles.js";
import { AppError } from "../../../errors/appError.js";

const listLoyaltyTransactionsService = async (authentication) => {
  const transactionRepository = AppDataSource.getRepository("LoyaltyTransaction");

  if (authentication.actorType === AUTH_ACTOR_TYPES.CLIENT) {
    return transactionRepository.find({
      where: { loyaltyAccount: { client: { id: authentication.actorId } } },
      relations: { loyaltyAccount: { client: true }, order: true },
      order: { createdAt: "DESC" },
    });
  }

  if (![USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(authentication.actor.role)) {
    throw new AppError("Você não possui acesso às transações de fidelidade.", 403);
  }

  return transactionRepository.find({
    relations: { loyaltyAccount: { client: true }, order: true },
    order: { createdAt: "DESC" },
  });
};

export default listLoyaltyTransactionsService;
