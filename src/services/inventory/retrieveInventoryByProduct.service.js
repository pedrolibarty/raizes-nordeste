import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const retrieveInventoryByProductService = async (productId) => {
  const inventoryRepository = AppDataSource.getRepository("Inventory");
  const foundInventory = await inventoryRepository.findOne({
    where: { product: { id: productId } },
    relations: { product: { branch: true } },
  });

  if (!foundInventory) {
    throw new AppError("Estoque do produto não encontrado.", 404);
  }

  return foundInventory;
};

export default retrieveInventoryByProductService;
