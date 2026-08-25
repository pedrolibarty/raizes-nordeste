import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";
import { USER_ROLES } from "../../constants/user-roles.js";
import registerAuditLogsService from "../auditLogs/registerAuditLogs.service.js";

const updatePromotionsService = async (promotionId, data, authenticatedUser) => {
  return AppDataSource.transaction(async (transactionManager) => {
  const promotionRepository = transactionManager.getRepository("Promotion");
  const productRepository = transactionManager.getRepository("Product");
  const foundPromotion = await promotionRepository.findOne({
    where: { id: promotionId },
    relations: { product: { branch: true }, user: true },
  });

  if (!foundPromotion) {
    throw new AppError("Promoção não encontrada.", 404);
  }
  if (
    authenticatedUser.role !== USER_ROLES.ADMIN &&
    authenticatedUser.branch.id !== foundPromotion.product.branch.id
  ) {
    throw new AppError("Gerentes só podem atualizar promoções da própria filial.", 403);
  }
  const oldData = {
    productId: foundPromotion.product.id,
    valDiscount: foundPromotion.valDiscount,
    extraPoints: foundPromotion.extraPoints,
    isActive: foundPromotion.isActive,
  };

  let promotionProduct = foundPromotion.product;

  if (data.productId !== undefined) {
    promotionProduct = await productRepository.findOne({
      where: { id: data.productId },
      relations: { branch: true },
    });

    if (!promotionProduct) {
      throw new AppError("Produto não encontrado.", 404);
    }
    if (
      authenticatedUser.role !== USER_ROLES.ADMIN &&
      authenticatedUser.branch.id !== promotionProduct.branch.id
    ) {
      throw new AppError("Gerentes não podem vincular promoções a outra filial.", 403);
    }
  }

  const valDiscount = data.valDiscount ?? Number(foundPromotion.valDiscount);
  const isActive = data.isActive ?? foundPromotion.isActive;

  if (valDiscount > Number(promotionProduct.price)) {
    throw new AppError("O desconto não pode ser maior que o preço do produto.", 422);
  }

  if (isActive) {
    const activePromotion = await promotionRepository.findOne({
      where: {
        product: { id: promotionProduct.id },
        isActive: true,
      },
    });

    if (activePromotion && activePromotion.id !== promotionId) {
      throw new AppError(
        "Este produto já possui uma promoção ativa.",
        409,
      );
    }
  }

  const updatedData = { ...data, product: promotionProduct };
  delete updatedData.productId;

  promotionRepository.merge(foundPromotion, updatedData);
  const updatedPromotion = await promotionRepository.save(foundPromotion);

  await registerAuditLogsService(transactionManager, {
    authentication: { actorId: authenticatedUser.id, actorType: "USER", actor: authenticatedUser },
    action: "UPDATE",
    entity: "Promotion",
    entityId: updatedPromotion.id,
    branchId: promotionProduct.branch.id,
    oldData,
    newData: { productId: promotionProduct.id, valDiscount: updatedPromotion.valDiscount, extraPoints: updatedPromotion.extraPoints, isActive: updatedPromotion.isActive },
  });

  return updatedPromotion;
  });
};

export default updatePromotionsService;
