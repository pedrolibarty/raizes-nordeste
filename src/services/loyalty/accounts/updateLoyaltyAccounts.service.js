import { AppDataSource } from "../../../data-source.js";
import { AUTH_ACTOR_TYPES } from "../../../constants/auth-actor-types.js";
import { AppError } from "../../../errors/appError.js";

const updateLoyaltyAccountsService = async (accountId, data, authentication) => {
  const accountRepository = AppDataSource.getRepository("LoyaltyAccount");
  const foundAccount = await accountRepository.findOne({ where: { id: accountId }, relations: { client: true } });
  if (!foundAccount) throw new AppError("Conta de fidelidade não encontrada.", 404);

  if (authentication.actorType !== AUTH_ACTOR_TYPES.CLIENT || authentication.actorId !== foundAccount.client.id) {
    throw new AppError("Somente o próprio cliente pode alterar sua conta de fidelidade.", 403);
  }

  foundAccount.hasConsent = data.hasConsent;
  foundAccount.consentedAt = data.hasConsent ? new Date() : null;
  return accountRepository.save(foundAccount);
};

export default updateLoyaltyAccountsService;
