import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const retrieveProductsService = async (productId) => {
  const productRepository = AppDataSource.getRepository("Product");
  const foundProduct = await productRepository.findOne({
    where: { id: productId },
    relations: { branch: true },
  });

  if (!foundProduct) {
    throw new AppError("Produto não encontrado.", 404);
  }

  const inventoryRepository = AppDataSource.getRepository("Inventory");
  const foundInventory = await inventoryRepository.findOne({
    where: { product: { id: productId } },
  });

  return {
    ...foundProduct,
    stockQuantity: foundInventory?.quantity ?? 0,
  };
};

export default retrieveProductsService;
