import createClientsService from "../services/clients/createClients.service.js";
import deleteClientsService from "../services/clients/deleteClients.service.js";
import listClientsService from "../services/clients/listClients.service.js";
import loginClientsService from "../services/clients/loginClients.service.js";
import retrieveClientsService from "../services/clients/retrieveClients.service.js";
import updateClientsService from "../services/clients/updateClients.service.js";

export const createClientsController = async (req, res) => {
  const data = req.body;
  const createdClient = await createClientsService(data);

  return res.status(201).json({ data: createdClient });
};

export const listClientsController = async (req, res) => {
  const clients = await listClientsService();

  return res.status(200).json({ data: clients });
};

export const loginClientsController = async (req, res) => {
  const { email, password } = req.body;
  const authentication = await loginClientsService(email, password);

  return res.status(200).json({ data: authentication });
};

export const retrieveClientsController = async (req, res) => {
  const clientId = req.params.id;
  const foundClient = await retrieveClientsService(clientId);

  return res.status(200).json({ data: foundClient });
};

export const updateClientsController = async (req, res) => {
  const clientId = req.params.id;
  const data = req.body;
  const updatedClient = await updateClientsService(clientId, data);

  return res.status(200).json({ data: updatedClient });
};

export const deleteClientsController = async (req, res) => {
  const clientId = req.params.id;
  await deleteClientsService(clientId);

  return res.status(204).send();
};
