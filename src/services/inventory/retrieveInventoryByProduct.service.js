import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";
import { USER_ROLES } from "../../constants/user-roles.js";

const retrieveInventoryByProductService = async (productId, authenticatedUser) => {
  const inventoryRepository = AppDataSource.getRepository("Inventory");
  const foundInventory = await inventoryRepository.findOne({
    where: { product: { id: productId } },
    relations: { product: { branch: true } },
  });

  if (!foundInventory) {
    throw new AppError("Estoque do produto não encontrado.", 404);
  }
  if (
    authenticatedUser.role !== USER_ROLES.ADMIN &&
    authenticatedUser.branch.id !== foundInventory.product.branch.id
  ) {
    throw new AppError("Você não pode consultar o estoque de outra filial.", 403);
  }

  return foundInventory;
};

export default retrieveInventoryByProductService;
