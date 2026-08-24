import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const retrievePromotionsService = async (promotionId) => {
  const promotionRepository = AppDataSource.getRepository("Promotion");
  const foundPromotion = await promotionRepository.findOne({
    where: { id: promotionId },
    relations: {
      product: { branch: true },
      user: true,
    },
  });

  if (!foundPromotion) {
    throw new AppError("Promoção não encontrada.", 404);
  }

  return foundPromotion;
};

export default retrievePromotionsService;
