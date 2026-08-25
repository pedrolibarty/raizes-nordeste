import createBranchesService from "../services/branches/createBranches.service.js";
import deleteBranchesService from "../services/branches/deleteBranches.service.js";
import listBranchesService from "../services/branches/listBranches.service.js";
import retrieveBranchesService from "../services/branches/retrieveBranches.service.js";
import updateBranchesService from "../services/branches/updateBranches.service.js";

export const createBranchesController = async (req, res) => {
  const data = req.body;
  const createdBranch = await createBranchesService(data);

  return res.status(201).json({ data: createdBranch });
};

export const listBranchesController = async (req, res) => {
  const branches = await listBranchesService();

  return res.status(200).json({ data: branches });
};

export const retrieveBranchesController = async (req, res) => {
  const branchId = req.params.id;
  const branch = await retrieveBranchesService(branchId);

  return res.status(200).json({ data: branch });
};

export const updateBranchesController = async (req, res) => {
  const branchId = req.params.id;
  const data = req.body;
  const updatedBranch = await updateBranchesService(branchId, data, req.user);

  return res.status(200).json({ data: updatedBranch });
};

export const deleteBranchesController = async (req, res) => {
  const branchId = req.params.id;
  await deleteBranchesService(branchId);

  return res.status(204).send();
};
