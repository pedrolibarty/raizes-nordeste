import { AppDataSource } from "../../../data-source.js";
import { AUTH_ACTOR_TYPES } from "../../../constants/auth-actor-types.js";
import { USER_ROLES } from "../../../constants/user-roles.js";
import { AppError } from "../../../errors/appError.js";

const listLoyaltyAccountsService = async (authentication) => {
  const accountRepository = AppDataSource.getRepository("LoyaltyAccount");

  if (authentication.actorType === AUTH_ACTOR_TYPES.CLIENT) {
    return accountRepository.find({
      where: { client: { id: authentication.actorId } },
      relations: { client: true },
    });
  }

  if (![USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(authentication.actor.role)) {
    throw new AppError("Você não possui acesso às contas de fidelidade.", 403);
  }

  return accountRepository.find({
    relations: { client: true },
    order: { createdAt: "DESC" },
  });
};

export default listLoyaltyAccountsService;
