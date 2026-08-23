import { AppDataSource } from "../../data-source.js";

const listInventoryService = async () => {
  const inventoryRepository = AppDataSource.getRepository("Inventory");
  const inventories = await inventoryRepository.find({
    relations: { product: { branch: true } },
    order: { product: { name: "ASC" } },
  });

  return inventories;
};

export default listInventoryService;
