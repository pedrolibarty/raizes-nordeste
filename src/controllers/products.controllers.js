import createProductsService from "../services/products/createProducts.service.js";
import deleteProductsService from "../services/products/deleteProducts.service.js";
import listProductsService from "../services/products/listProducts.service.js";
import retrieveProductsService from "../services/products/retrieveProducts.service.js";
import updateProductsService from "../services/products/updateProducts.service.js";

export const createProductsController = async (req, res) => {
  const data = req.body;
  const createdProduct = await createProductsService(data);

  return res.status(201).json({ data: createdProduct });
};

export const listProductsController = async (req, res) => {
  const products = await listProductsService();

  return res.status(200).json({ data: products });
};

export const retrieveProductsController = async (req, res) => {
  const productId = req.params.id;
  const foundProduct = await retrieveProductsService(productId);

  return res.status(200).json({ data: foundProduct });
};

export const updateProductsController = async (req, res) => {
  const productId = req.params.id;
  const data = req.body;
  const updatedProduct = await updateProductsService(productId, data);

  return res.status(200).json({ data: updatedProduct });
};

export const deleteProductsController = async (req, res) => {
  const productId = req.params.id;
  await deleteProductsService(productId);

  return res.status(204).send();
};
