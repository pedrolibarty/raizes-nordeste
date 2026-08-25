import listInventoryService from "../services/inventory/listInventory.service.js";
import listInventoryByBranchService from "../services/inventory/listInventoryByBranch.service.js";
import retrieveInventoryService from "../services/inventory/retrieveInventory.service.js";
import retrieveInventoryByProductService from "../services/inventory/retrieveInventoryByProduct.service.js";

export const listInventoryController = async (req, res) => {
  const inventories = await listInventoryService(req.user);

  return res.status(200).json({ data: inventories });
};

export const retrieveInventoryController = async (req, res) => {
  const inventoryId = req.params.id;
  const foundInventory = await retrieveInventoryService(inventoryId, req.user);

  return res.status(200).json({ data: foundInventory });
};

export const retrieveInventoryByProductController = async (req, res) => {
  const productId = req.params.productId;
  const foundInventory = await retrieveInventoryByProductService(productId, req.user);

  return res.status(200).json({ data: foundInventory });
};

export const listInventoryByBranchController = async (req, res) => {
  const branchId = req.params.branchId;
  const inventories = await listInventoryByBranchService(branchId, req.user);

  return res.status(200).json({ data: inventories });
};
