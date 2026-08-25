import bcrypt from "bcrypt";
import { AppDataSource } from "../../data-source.js";
import { USER_ROLES } from "../../constants/user-roles.js";
import { AppError } from "../../errors/appError.js";

const createUsersService = async (data, authenticatedUser) => {
  const userRepository = AppDataSource.getRepository("User");
  const branchRepository = AppDataSource.getRepository("Branch");
  const privilegedRoles = [USER_ROLES.ADMIN, USER_ROLES.MANAGER];

  if (
    privilegedRoles.includes(data.role) &&
    authenticatedUser.role !== USER_ROLES.ADMIN
  ) {
    throw new AppError(
      "Somente um administrador pode criar usuários ADMIN ou MANAGER.",
      403,
    );
  }

  const existingUser = await userRepository.findOneBy({ email: data.email });

  if (existingUser) {
    throw new AppError("Já existe um usuário cadastrado com este e-mail.", 409);
  }

  const foundBranch = await branchRepository.findOneBy({ id: data.branchId });

  if (!foundBranch) {
    throw new AppError("A filial informada não foi encontrada.", 404);
  }
  if (
    authenticatedUser.role === USER_ROLES.MANAGER &&
    authenticatedUser.branch.id !== foundBranch.id
  ) {
    throw new AppError("Gerentes só podem criar funcionários na própria filial.", 403);
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const createdUser = userRepository.create({
    name: data.name,
    role: data.role,
    email: data.email,
    password: passwordHash,
    isActive: data.isActive ?? true,
    branch: foundBranch,
  });
  const savedUser = await userRepository.save(createdUser);

  delete savedUser.password;
  return savedUser;
};

export default createUsersService;
