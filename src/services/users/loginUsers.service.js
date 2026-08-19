import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const loginUsersService = async (email, password) => {
  const userRepository = AppDataSource.getRepository("User");
  const foundUser = await userRepository
    .createQueryBuilder("user")
    .addSelect("user.password")
    .where("LOWER(user.email) = :email", { email })
    .getOne();

  if (!foundUser) {
    throw new AppError("E-mail ou senha inválidos.", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, foundUser.password);

  if (!isPasswordValid) {
    throw new AppError("E-mail ou senha inválidos.", 401);
  }

  if (!foundUser.isActive) {
    throw new AppError("Este usuário está inativo e não pode acessar o sistema.", 403);
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("A variável de ambiente JWT_SECRET não foi configurada.");
  }

  const token = jwt.sign(
    { role: foundUser.role },
    process.env.JWT_SECRET,
    {
      subject: foundUser.id,
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    },
  );

  const { password: passwordHash, ...userWithoutPassword } = foundUser;

  return {
    token,
    user: userWithoutPassword,
  };
};

export default loginUsersService;
