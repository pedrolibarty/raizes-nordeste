import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const deletePromotionsService = async (promotionId) => {
  const promotionRepository = AppDataSource.getRepository("Promotion");
  const foundPromotion = await promotionRepository.findOneBy({ id: promotionId });

  if (!foundPromotion) {
    throw new AppError("Promoção não encontrada.", 404);
  }

  await promotionRepository.remove(foundPromotion);
};

export default deletePromotionsService;
