import { AppDataSource } from "../../data-source.js";
import { USER_ROLES } from "../../constants/user-roles.js";
import { AppError } from "../../errors/appError.js";

const deleteUsersService = async (userId, authenticatedUser) => {
  const userRepository = AppDataSource.getRepository("User");
  const foundUser = await userRepository.findOne({
    where: { id: userId },
    relations: { branch: true },
  });

  if (!foundUser) {
    throw new AppError("Usuário não encontrado.", 404);
  }
  if (
    authenticatedUser.role === USER_ROLES.MANAGER &&
    authenticatedUser.branch.id !== foundUser.branch.id
  ) {
    throw new AppError("Gerentes só podem excluir funcionários da própria filial.", 403);
  }

  if (
    authenticatedUser.role === USER_ROLES.MANAGER &&
    [USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(foundUser.role)
  ) {
    throw new AppError(
      "Gerentes não podem excluir usuários ADMIN ou MANAGER.",
      403,
    );
  }

  await userRepository.remove(foundUser);
};

export default deleteUsersService;
