import createLoyaltyAccountsService from "../services/loyalty/accounts/createLoyaltyAccounts.service.js";
import deleteLoyaltyAccountsService from "../services/loyalty/accounts/deleteLoyaltyAccounts.service.js";
import listLoyaltyAccountsService from "../services/loyalty/accounts/listLoyaltyAccounts.service.js";
import retrieveLoyaltyAccountsService from "../services/loyalty/accounts/retrieveLoyaltyAccounts.service.js";
import updateLoyaltyAccountsService from "../services/loyalty/accounts/updateLoyaltyAccounts.service.js";

export const createLoyaltyAccountsController = async (req, res) => {
  const createdAccount = await createLoyaltyAccountsService(req.body, req.auth);
  return res.status(201).json({ data: createdAccount });
};

export const listLoyaltyAccountsController = async (req, res) => {
  const accounts = await listLoyaltyAccountsService(req.auth);
  return res.status(200).json({ data: accounts });
};

export const retrieveLoyaltyAccountsController = async (req, res) => {
  const foundAccount = await retrieveLoyaltyAccountsService(req.params.id, req.auth);
  return res.status(200).json({ data: foundAccount });
};

export const updateLoyaltyAccountsController = async (req, res) => {
  const updatedAccount = await updateLoyaltyAccountsService(req.params.id, req.body, req.auth);
  return res.status(200).json({ data: updatedAccount });
};

export const deleteLoyaltyAccountsController = async (req, res) => {
  await deleteLoyaltyAccountsService(req.params.id, req.auth);
  return res.status(204).send();
};
