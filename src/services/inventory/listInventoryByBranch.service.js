import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";
import { USER_ROLES } from "../../constants/user-roles.js";

const listInventoryByBranchService = async (branchId, authenticatedUser) => {
  const branchRepository = AppDataSource.getRepository("Branch");
  const inventoryRepository = AppDataSource.getRepository("Inventory");
  const foundBranch = await branchRepository.findOneBy({ id: branchId });

  if (!foundBranch) {
    throw new AppError("Filial não encontrada.", 404);
  }
  if (
    authenticatedUser.role !== USER_ROLES.ADMIN &&
    authenticatedUser.branch.id !== branchId
  ) {
    throw new AppError("Você não pode consultar o estoque de outra filial.", 403);
  }

  const inventories = await inventoryRepository.find({
    where: { product: { branch: { id: branchId } } },
    relations: { product: { branch: true } },
    order: { product: { name: "ASC" } },
  });

  return inventories;
};

export default listInventoryByBranchService;
