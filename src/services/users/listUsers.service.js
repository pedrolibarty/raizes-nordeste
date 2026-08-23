import { AppDataSource } from "../../data-source.js";

const listUsersService = async () => {
  const userRepository = AppDataSource.getRepository("User");
  const users = await userRepository.find({
    relations: { branch: true },
    order: { name: "ASC" },
  });

  return users;
};

export default listUsersService;
