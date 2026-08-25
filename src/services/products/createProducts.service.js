import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";
import { USER_ROLES } from "../../constants/user-roles.js";

const createProductsService = async (data, authenticatedUser) => {
  return AppDataSource.transaction(async (transactionManager) => {
    const productRepository = transactionManager.getRepository("Product");
    const branchRepository = transactionManager.getRepository("Branch");
    const inventoryRepository = transactionManager.getRepository("Inventory");
    const foundBranch = await branchRepository.findOneBy({ id: data.branchId });

    if (!foundBranch) {
      throw new AppError("A filial informada não foi encontrada.", 404);
    }
    if (
      authenticatedUser.role !== USER_ROLES.ADMIN &&
      authenticatedUser.branch.id !== foundBranch.id
    ) {
      throw new AppError("Gerentes só podem criar produtos na própria filial.", 403);
    }

    const existingProduct = await productRepository.findOne({
      where: {
        productCode: data.productCode,
        branch: { id: data.branchId },
      },
    });

    if (existingProduct) {
      throw new AppError(
        `Já existe um produto com o código ${data.productCode} nesta filial.`,
        409,
      );
    }

    const createdProduct = productRepository.create({
      productCode: data.productCode,
      name: data.name,
      category: data.category,
      isAvailable: data.isAvailable ?? true,
      isActive: data.isActive ?? true,
      price: data.price,
      branch: foundBranch,
    });
    const savedProduct = await productRepository.save(createdProduct);
    const createdInventory = inventoryRepository.create({
      product: savedProduct,
      quantity: 0,
    });

    await inventoryRepository.save(createdInventory);
    return savedProduct;
  });
};

export default createProductsService;
