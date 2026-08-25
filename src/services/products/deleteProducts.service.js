import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";
import { USER_ROLES } from "../../constants/user-roles.js";

const deleteProductsService = async (productId, authenticatedUser) => {
  await AppDataSource.transaction(async (transactionManager) => {
    const productRepository = transactionManager.getRepository("Product");
    const inventoryRepository = transactionManager.getRepository("Inventory");
    const foundProduct = await productRepository.findOne({
      where: { id: productId },
      relations: { branch: true },
    });

    if (!foundProduct) {
      throw new AppError("Produto não encontrado.", 404);
    }
    if (
      authenticatedUser.role !== USER_ROLES.ADMIN &&
      authenticatedUser.branch.id !== foundProduct.branch.id
    ) {
      throw new AppError("Gerentes só podem excluir produtos da própria filial.", 403);
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
