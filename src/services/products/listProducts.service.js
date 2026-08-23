import { AppDataSource } from "../../data-source.js";

const listProductsService = async () => {
  const productRepository = AppDataSource.getRepository("Product");
  const products = await productRepository.find({
    relations: { branch: true },
    order: { name: "ASC" },
  });

  return products;
};

export default listProductsService;
