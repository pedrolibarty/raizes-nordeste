import { AppDataSource } from "../../data-source.js";
import { USER_ROLES } from "../../constants/user-roles.js";

const listUsersService = async (authenticatedUser) => {
  const userRepository = AppDataSource.getRepository("User");
  const users = await userRepository.find({
    where: authenticatedUser.role === USER_ROLES.ADMIN
      ? {}
      : { branch: { id: authenticatedUser.branch.id } },
    relations: { branch: true },
    order: { name: "ASC" },
  });

  return users;
};

export default listUsersService;
