import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const retrieveInventoryService = async (inventoryId) => {
  const inventoryRepository = AppDataSource.getRepository("Inventory");
  const foundInventory = await inventoryRepository.findOne({
    where: { id: inventoryId },
    relations: { product: { branch: true } },
  });

  if (!foundInventory) {
    throw new AppError("Estoque não encontrado.", 404);
  }

  return foundInventory;
};

export default retrieveInventoryService;
