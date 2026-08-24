import { AppDataSource } from "../../../data-source.js";
import { AUTH_ACTOR_TYPES } from "../../../constants/auth-actor-types.js";
import { AppError } from "../../../errors/appError.js";

const createLoyaltyAccountsService = async (data, authentication) => {
  if (authentication.actorType !== AUTH_ACTOR_TYPES.CLIENT || authentication.actorId !== data.clientId) {
    throw new AppError("Somente o próprio cliente pode criar sua conta de fidelidade.", 403);
  }

  const accountRepository = AppDataSource.getRepository("LoyaltyAccount");
  const clientRepository = AppDataSource.getRepository("Client");
  const existingAccount = await accountRepository.findOne({ where: { client: { id: data.clientId } } });
  if (existingAccount) throw new AppError("Este cliente já possui uma conta de fidelidade.", 409);

  const foundClient = await clientRepository.findOneBy({ id: data.clientId });
  if (!foundClient) throw new AppError("Cliente não encontrado.", 404);

  const createdAccount = accountRepository.create({
    client: foundClient,
    hasConsent: data.hasConsent ?? false,
    consentedAt: data.hasConsent ? new Date() : null,
    pointsBalance: 0,
  });
  return accountRepository.save(createdAccount);
};

export default createLoyaltyAccountsService;
