import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const createPromotionsService = async (data, authenticatedUser) => {
  const promotionRepository = AppDataSource.getRepository("Promotion");
  const productRepository = AppDataSource.getRepository("Product");
  const foundProduct = await productRepository.findOne({
    where: { id: data.productId },
    relations: { branch: true },
  });

  if (!foundProduct) {
    throw new AppError("Produto não encontrado.", 404);
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

  return savedPromotion;
};

export default createPromotionsService;
