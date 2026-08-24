import createLoyaltyTransactionsService from "../services/loyalty/transactions/createLoyaltyTransactions.service.js";
import listLoyaltyTransactionsService from "../services/loyalty/transactions/listLoyaltyTransactions.service.js";
import retrieveLoyaltyTransactionsService from "../services/loyalty/transactions/retrieveLoyaltyTransactions.service.js";

export const createLoyaltyTransactionsController = async (req, res) => {
  const createdTransaction = await createLoyaltyTransactionsService(req.body, req.auth);
  return res.status(201).json({ data: createdTransaction });
};

export const listLoyaltyTransactionsController = async (req, res) => {
  const transactions = await listLoyaltyTransactionsService(req.auth);
  return res.status(200).json({ data: transactions });
};

export const retrieveLoyaltyTransactionsController = async (req, res) => {
  const foundTransaction = await retrieveLoyaltyTransactionsService(req.params.id, req.auth);
  return res.status(200).json({ data: foundTransaction });
};
