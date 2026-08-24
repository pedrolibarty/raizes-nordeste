import { AppDataSource } from "../../data-source.js";

const listPromotionsService = async () => {
  const promotionRepository = AppDataSource.getRepository("Promotion");
  const promotions = await promotionRepository.find({
    relations: {
      product: { branch: true },
      user: true,
    },
    order: { createdAt: "DESC" },
  });

  return promotions;
};

export default listPromotionsService;
