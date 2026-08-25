import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";
import { USER_ROLES } from "../../constants/user-roles.js";

const retrieveInventoryService = async (inventoryId, authenticatedUser) => {
  const inventoryRepository = AppDataSource.getRepository("Inventory");
  const foundInventory = await inventoryRepository.findOne({
    where: { id: inventoryId },
    relations: { product: { branch: true } },
  });

  if (!foundInventory) {
    throw new AppError("Estoque não encontrado.", 404);
  }
  if (
    authenticatedUser.role !== USER_ROLES.ADMIN &&
    authenticatedUser.branch.id !== foundInventory.product.branch.id
  ) {
    throw new AppError("Você não pode consultar o estoque de outra filial.", 403);
  }

  return foundInventory;
};

export default retrieveInventoryService;
