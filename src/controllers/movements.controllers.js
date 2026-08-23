import createMovementsService from "../services/movements/createMovements.service.js";
import listMovementsService from "../services/movements/listMovements.service.js";
import retrieveMovementsService from "../services/movements/retrieveMovements.service.js";

export const createMovementsController = async (req, res) => {
  const data = req.body;
  const authenticatedUser = req.user;
  const createdMovement = await createMovementsService(data, authenticatedUser);

  return res.status(201).json({ data: createdMovement });
};

export const listMovementsController = async (req, res) => {
  const movements = await listMovementsService();

  return res.status(200).json({ data: movements });
};

export const retrieveMovementsController = async (req, res) => {
  const movementId = req.params.id;
  const foundMovement = await retrieveMovementsService(movementId);

  return res.status(200).json({ data: foundMovement });
};
