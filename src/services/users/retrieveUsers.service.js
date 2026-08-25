import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";
import { USER_ROLES } from "../../constants/user-roles.js";

const retrieveUsersService = async (userId, authenticatedUser) => {
  const userRepository = AppDataSource.getRepository("User");
  const foundUser = await userRepository.findOne({
    where: { id: userId },
    relations: { branch: true },
  });

  if (!foundUser) {
    throw new AppError("Usuário não encontrado.", 404);
  }
  if (
    authenticatedUser.role !== USER_ROLES.ADMIN &&
    authenticatedUser.branch.id !== foundUser.branch.id
  ) {
    throw new AppError("Gerentes só podem consultar funcionários da própria filial.", 403);
  }

  return foundUser;
};

export default retrieveUsersService;
