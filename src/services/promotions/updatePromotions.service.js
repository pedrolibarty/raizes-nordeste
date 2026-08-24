import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const updatePromotionsService = async (promotionId, data) => {
  const promotionRepository = AppDataSource.getRepository("Promotion");
  const productRepository = AppDataSource.getRepository("Product");
  const foundPromotion = await promotionRepository.findOne({
    where: { id: promotionId },
    relations: { product: { branch: true }, user: true },
  });

  if (!foundPromotion) {
    throw new AppError("Promoção não encontrada.", 404);
  }

  let promotionProduct = foundPromotion.product;

  if (data.productId !== undefined) {
    promotionProduct = await productRepository.findOne({
      where: { id: data.productId },
      relations: { branch: true },
    });

    if (!promotionProduct) {
      throw new AppError("Produto não encontrado.", 404);
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

  return updatedPromotion;
};

export default updatePromotionsService;
