import { AppDataSource } from "../../../data-source.js";
import { AUTH_ACTOR_TYPES } from "../../../constants/auth-actor-types.js";
import { USER_ROLES } from "../../../constants/user-roles.js";
import { AppError } from "../../../errors/appError.js";

const deleteLoyaltyAccountsService = async (accountId, authentication) => {
  const accountRepository = AppDataSource.getRepository("LoyaltyAccount");
  const foundAccount = await accountRepository.findOne({ where: { id: accountId }, relations: { client: true } });
  if (!foundAccount) throw new AppError("Conta de fidelidade não encontrada.", 404);

  const isOwner =
    authentication.actorType === AUTH_ACTOR_TYPES.CLIENT &&
    authentication.actorId === foundAccount.client.id;
  const isAdmin =
    authentication.actorType === AUTH_ACTOR_TYPES.USER &&
    authentication.actor.role === USER_ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new AppError(
      "Somente o próprio cliente ou um administrador pode excluir esta conta de fidelidade.",
      403,
    );
  }

  await accountRepository.remove(foundAccount);
};

export default deleteLoyaltyAccountsService;
