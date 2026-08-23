import createUsersService from "../services/users/createUsers.service.js";
import deleteUsersService from "../services/users/deleteUsers.service.js";
import listUsersService from "../services/users/listUsers.service.js";
import loginUsersService from "../services/users/loginUsers.service.js";
import retrieveUsersService from "../services/users/retrieveUsers.service.js";
import updateUsersService from "../services/users/updateUsers.service.js";

export const createUsersController = async (req, res) => {
  const data = req.body;
  const authenticatedUser = req.user;
  const createdUser = await createUsersService(data, authenticatedUser);

  return res.status(201).json({ data: createdUser });
};

export const listUsersController = async (req, res) => {
  const users = await listUsersService();

  return res.status(200).json({ data: users });
};

export const retrieveUsersController = async (req, res) => {
  const userId = req.params.id;
  const foundUser = await retrieveUsersService(userId);

  return res.status(200).json({ data: foundUser });
};

export const updateUsersController = async (req, res) => {
  const userId = req.params.id;
  const data = req.body;
  const authenticatedUser = req.user;
  const updatedUser = await updateUsersService(
    userId,
    data,
    authenticatedUser,
  );

  return res.status(200).json({ data: updatedUser });
};

export const deleteUsersController = async (req, res) => {
  const userId = req.params.id;
  const authenticatedUser = req.user;
  await deleteUsersService(userId, authenticatedUser);

  return res.status(204).send();
};

export const loginUsersController = async (req, res) => {
  const { email, password } = req.body;
  const authentication = await loginUsersService(email, password);

  return res.status(200).json({ data: authentication });
};
