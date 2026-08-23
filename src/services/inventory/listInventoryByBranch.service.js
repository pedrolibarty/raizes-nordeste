import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const listInventoryByBranchService = async (branchId) => {
  const branchRepository = AppDataSource.getRepository("Branch");
  const inventoryRepository = AppDataSource.getRepository("Inventory");
  const foundBranch = await branchRepository.findOneBy({ id: branchId });

  if (!foundBranch) {
    throw new AppError("Filial não encontrada.", 404);
  }

  const inventories = await inventoryRepository.find({
    where: { product: { branch: { id: branchId } } },
    relations: { product: { branch: true } },
    order: { product: { name: "ASC" } },
  });

  return inventories;
};

export default listInventoryByBranchService;
