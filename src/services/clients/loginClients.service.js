import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../data-source.js";
import { AUTH_ACTOR_TYPES } from "../../constants/auth-actor-types.js";
import { AppError } from "../../errors/appError.js";

const loginClientsService = async (email, password) => {
  const clientRepository = AppDataSource.getRepository("Client");
  const foundClient = await clientRepository
    .createQueryBuilder("client")
    .addSelect("client.password")
    .where("LOWER(client.email) = :email", { email })
    .getOne();

  if (!foundClient) {
    throw new AppError("E-mail ou senha inválidos.", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, foundClient.password);

  if (!isPasswordValid) {
    throw new AppError("E-mail ou senha inválidos.", 401);
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("A variável de ambiente JWT_SECRET não foi configurada.");
  }

  const token = jwt.sign(
    { actorType: AUTH_ACTOR_TYPES.CLIENT },
    process.env.JWT_SECRET,
    {
      subject: foundClient.id,
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    },
  );

  const { password: passwordHash, ...clientWithoutPassword } = foundClient;

  return {
    token,
    client: clientWithoutPassword,
  };
};

export default loginClientsService;
