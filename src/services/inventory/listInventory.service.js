import { AppDataSource } from "../../data-source.js";
import { USER_ROLES } from "../../constants/user-roles.js";

const listInventoryService = async (authenticatedUser) => {
  const inventoryRepository = AppDataSource.getRepository("Inventory");
  const inventories = await inventoryRepository.find({
    where: authenticatedUser.role === USER_ROLES.ADMIN
      ? {}
      : { product: { branch: { id: authenticatedUser.branch.id } } },
    relations: { product: { branch: true } },
    order: { product: { name: "ASC" } },
  });

  return inventories;
};

export default listInventoryService;
