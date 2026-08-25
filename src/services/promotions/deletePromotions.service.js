import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";
import { USER_ROLES } from "../../constants/user-roles.js";
import registerAuditLogsService from "../auditLogs/registerAuditLogs.service.js";

const deletePromotionsService = async (promotionId, authenticatedUser) => {
  return AppDataSource.transaction(async (transactionManager) => {
  const promotionRepository = transactionManager.getRepository("Promotion");
  const foundPromotion = await promotionRepository.findOne({ where: { id: promotionId }, relations: { product: { branch: true } } });

  if (!foundPromotion) {
    throw new AppError("Promoção não encontrada.", 404);
  }
  if (
    authenticatedUser.role !== USER_ROLES.ADMIN &&
    authenticatedUser.branch.id !== foundPromotion.product.branch.id
  ) {
    throw new AppError("Gerentes só podem desativar promoções da própria filial.", 403);
  }

  const wasActive = foundPromotion.isActive;
  foundPromotion.isActive = false;
  await promotionRepository.save(foundPromotion);
  await registerAuditLogsService(transactionManager, {
    authentication: { actorId: authenticatedUser.id, actorType: "USER", actor: authenticatedUser },
    action: "DEACTIVATE",
    entity: "Promotion",
    entityId: foundPromotion.id,
    branchId: foundPromotion.product.branch.id,
    oldData: { isActive: wasActive },
    newData: { isActive: false },
  });
  });
};

export default deletePromotionsService;
