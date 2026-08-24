import { AppDataSource } from "../../../data-source.js";
import { AUTH_ACTOR_TYPES } from "../../../constants/auth-actor-types.js";
import { USER_ROLES } from "../../../constants/user-roles.js";
import { AppError } from "../../../errors/appError.js";

const retrieveLoyaltyAccountsService = async (accountId, authentication) => {
  const accountRepository = AppDataSource.getRepository("LoyaltyAccount");
  const foundAccount = await accountRepository.findOne({ where: { id: accountId }, relations: { client: true } });
  if (!foundAccount) throw new AppError("Conta de fidelidade não encontrada.", 404);

  const isOwner = authentication.actorType === AUTH_ACTOR_TYPES.CLIENT && authentication.actorId === foundAccount.client.id;
  const canView = authentication.actorType === AUTH_ACTOR_TYPES.USER && [USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(authentication.actor.role);
  if (!isOwner && !canView) throw new AppError("Você não possui acesso a esta conta de fidelidade.", 403);

  return foundAccount;
};

export default retrieveLoyaltyAccountsService;
