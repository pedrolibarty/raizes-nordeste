import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const retrieveUsersService = async (userId) => {
  const userRepository = AppDataSource.getRepository("User");
  const foundUser = await userRepository.findOne({
    where: { id: userId },
    relations: { branch: true },
  });

  if (!foundUser) {
    throw new AppError("Usuário não encontrado.", 404);
  }

  return foundUser;
};

export default retrieveUsersService;
