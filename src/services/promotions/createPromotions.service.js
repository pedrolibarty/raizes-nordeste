import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";
import { USER_ROLES } from "../../constants/user-roles.js";
import registerAuditLogsService from "../auditLogs/registerAuditLogs.service.js";

const createPromotionsService = async (data, authenticatedUser) => {
  return AppDataSource.transaction(async (transactionManager) => {
  const promotionRepository = transactionManager.getRepository("Promotion");
  const productRepository = transactionManager.getRepository("Product");
  const foundProduct = await productRepository.findOne({
    where: { id: data.productId },
    relations: { branch: true },
  });

  if (!foundProduct) {
    throw new AppError("Produto não encontrado.", 404);
  }
  if (
    authenticatedUser.role !== USER_ROLES.ADMIN &&
    authenticatedUser.branch.id !== foundProduct.branch.id
  ) {
    throw new AppError("Gerentes só podem criar promoções na própria filial.", 403);
  }

  if (data.isActive ?? true) {
    const activePromotion = await promotionRepository.findOne({
      where: {
        product: { id: data.productId },
        isActive: true,
      },
    });

    if (activePromotion) {
      throw new AppError(
        "Este produto já possui uma promoção ativa.",
        409,
      );
    }
  }

  const valDiscount = data.valDiscount ?? 0;

  if (valDiscount > Number(foundProduct.price)) {
    throw new AppError("O desconto não pode ser maior que o preço do produto.", 422);
  }

  const createdPromotion = promotionRepository.create({
    description: data.description,
    valDiscount,
    extraPoints: data.extraPoints ?? 0,
    isActive: data.isActive ?? true,
    product: foundProduct,
    user: authenticatedUser,
  });
  const savedPromotion = await promotionRepository.save(createdPromotion);

  await registerAuditLogsService(transactionManager, {
    authentication: { actorId: authenticatedUser.id, actorType: "USER", actor: authenticatedUser },
    action: "CREATE",
    entity: "Promotion",
    entityId: savedPromotion.id,
    branchId: foundProduct.branch.id,
    newData: { productId: foundProduct.id, valDiscount, extraPoints: savedPromotion.extraPoints, isActive: savedPromotion.isActive },
  });

  return savedPromotion;
  });
};

export default createPromotionsService;
