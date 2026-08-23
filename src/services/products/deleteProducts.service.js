import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const deleteProductsService = async (productId) => {
  await AppDataSource.transaction(async (transactionManager) => {
    const productRepository = transactionManager.getRepository("Product");
    const inventoryRepository = transactionManager.getRepository("Inventory");
    const foundProduct = await productRepository.findOneBy({ id: productId });

    if (!foundProduct) {
      throw new AppError("Produto não encontrado.", 404);
    }

    const foundInventory = await inventoryRepository.findOne({
      where: { product: { id: productId } },
    });

    if (foundInventory) {
      await inventoryRepository.remove(foundInventory);
    }

    await productRepository.remove(foundProduct);
  });
};

export default deleteProductsService;
