import { AppDataSource } from "../../../data-source.js";
import { AUTH_ACTOR_TYPES } from "../../../constants/auth-actor-types.js";
import { USER_ROLES } from "../../../constants/user-roles.js";
import { AppError } from "../../../errors/appError.js";

const retrieveLoyaltyTransactionsService = async (transactionId, authentication) => {
  const transactionRepository = AppDataSource.getRepository("LoyaltyTransaction");
  const foundTransaction = await transactionRepository.findOne({ where: { id: transactionId }, relations: { loyaltyAccount: { client: true }, order: true } });
  if (!foundTransaction) throw new AppError("Transação de fidelidade não encontrada.", 404);

  const isOwner = authentication.actorType === AUTH_ACTOR_TYPES.CLIENT && authentication.actorId === foundTransaction.loyaltyAccount.client.id;
  const canView = authentication.actorType === AUTH_ACTOR_TYPES.USER && [USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(authentication.actor.role);
  if (!isOwner && !canView) throw new AppError("Você não possui acesso a esta transação de fidelidade.", 403);
  return foundTransaction;
};

export default retrieveLoyaltyTransactionsService;
