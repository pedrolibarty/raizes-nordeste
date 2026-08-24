import createPromotionsService from "../services/promotions/createPromotions.service.js";
import deletePromotionsService from "../services/promotions/deletePromotions.service.js";
import listPromotionsService from "../services/promotions/listPromotions.service.js";
import retrievePromotionsService from "../services/promotions/retrievePromotions.service.js";
import updatePromotionsService from "../services/promotions/updatePromotions.service.js";

export const createPromotionsController = async (req, res) => {
  const data = req.body;
  const authenticatedUser = req.user;
  const createdPromotion = await createPromotionsService(data, authenticatedUser);

  return res.status(201).json({ data: createdPromotion });
};

export const listPromotionsController = async (req, res) => {
  const promotions = await listPromotionsService();

  return res.status(200).json({ data: promotions });
};

export const retrievePromotionsController = async (req, res) => {
  const promotionId = req.params.id;
  const foundPromotion = await retrievePromotionsService(promotionId);

  return res.status(200).json({ data: foundPromotion });
};

export const updatePromotionsController = async (req, res) => {
  const promotionId = req.params.id;
  const data = req.body;
  const updatedPromotion = await updatePromotionsService(promotionId, data);

  return res.status(200).json({ data: updatedPromotion });
};

export const deletePromotionsController = async (req, res) => {
  const promotionId = req.params.id;
  await deletePromotionsService(promotionId);

  return res.status(204).send();
};
