import { In } from "typeorm";
import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const listProductsByBranchService = async (branchId) => {
  const branchRepository = AppDataSource.getRepository("Branch");
  const productRepository = AppDataSource.getRepository("Product");
  const foundBranch = await branchRepository.findOneBy({ id: branchId });

  if (!foundBranch) {
    throw new AppError("Filial não encontrada.", 404);
  }

  const products = await productRepository.find({
    where: { branch: { id: branchId } },
    relations: { branch: true },
    order: { name: "ASC" },
  });

  if (!products.length) {
    return [];
  }

  const inventoryRepository = AppDataSource.getRepository("Inventory");
  const productIds = products.map((product) => product.id);
  const inventories = await inventoryRepository.find({
    where: { product: { id: In(productIds) } },
    relations: { product: true },
  });
  const stockByProductId = new Map(
    inventories.map((inventory) => [inventory.product.id, inventory.quantity]),
  );

  return products.map((product) => ({
    ...product,
    stockQuantity: stockByProductId.get(product.id) ?? 0,
  }));
};

export default listProductsByBranchService;
