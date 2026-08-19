import loginUsersService from "../services/users/loginUsers.service.js";

export const loginUsersController = async (req, res) => {
  const { email, password } = req.body;
  const authentication = await loginUsersService(email, password);

  return res.status(200).json({ data: authentication });
};
