import bcrypt from "bcrypt";
import { AppDataSource } from "../../data-source.js";
import { USER_ROLES } from "../../constants/user-roles.js";
import { AppError } from "../../errors/appError.js";

const updateUsersService = async (userId, data, authenticatedUser) => {
  const userRepository = AppDataSource.getRepository("User");
  const branchRepository = AppDataSource.getRepository("Branch");
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
    throw new AppError("Gerentes só podem atualizar funcionários da própria filial.", 403);
  }

  const privilegedRoles = [USER_ROLES.ADMIN, USER_ROLES.MANAGER];

  if (
    authenticatedUser.role === USER_ROLES.MANAGER &&
    (privilegedRoles.includes(foundUser.role) || privilegedRoles.includes(data.role))
  ) {
    throw new AppError(
      "Gerentes não podem alterar usuários ADMIN ou MANAGER nem atribuir esses papéis.",
      403,
    );
  }

  if (data.email !== undefined && data.email !== foundUser.email) {
    const existingUser = await userRepository.findOneBy({ email: data.email });

    if (existingUser) {
      throw new AppError("Já existe um usuário cadastrado com este e-mail.", 409);
    }
  }

  if (data.branchId !== undefined) {
    const foundBranch = await branchRepository.findOneBy({ id: data.branchId });

    if (!foundBranch) {
      throw new AppError("A filial informada não foi encontrada.", 404);
    }
    if (
      authenticatedUser.role === USER_ROLES.MANAGER &&
      authenticatedUser.branch.id !== foundBranch.id
    ) {
      throw new AppError("Gerentes não podem mover funcionários para outra filial.", 403);
    }

    foundUser.branch = foundBranch;
  }

  const updatedData = { ...data };
  delete updatedData.branchId;

  if (updatedData.password !== undefined) {
    updatedData.password = await bcrypt.hash(updatedData.password, 10);
  }

  userRepository.merge(foundUser, updatedData);
  const updatedUser = await userRepository.save(foundUser);

  delete updatedUser.password;
  return updatedUser;
};

export default updateUsersService;
