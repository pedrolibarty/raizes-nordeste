import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const updateProductsService = async (productId, data) => {
  const productRepository = AppDataSource.getRepository("Product");
  const branchRepository = AppDataSource.getRepository("Branch");
  const foundProduct = await productRepository.findOne({
    where: { id: productId },
    relations: { branch: true },
  });

  if (!foundProduct) {
    throw new AppError("Produto não encontrado.", 404);
  }

  let productBranch = foundProduct.branch;

  if (data.branchId !== undefined) {
    productBranch = await branchRepository.findOneBy({ id: data.branchId });

    if (!productBranch) {
      throw new AppError("A filial informada não foi encontrada.", 404);
    }
  }

  const productCode = data.productCode ?? foundProduct.productCode;
  const existingProduct = await productRepository.findOne({
    where: {
      productCode,
      branch: { id: productBranch.id },
    },
  });

  if (existingProduct && existingProduct.id !== productId) {
    throw new AppError(
      `Já existe um produto com o código ${productCode} nesta filial.`,
      409,
    );
  }

  const updatedData = { ...data, branch: productBranch };
  delete updatedData.branchId;

  productRepository.merge(foundProduct, updatedData);
  const updatedProduct = await productRepository.save(foundProduct);

  return updatedProduct;
};

export default updateProductsService;
