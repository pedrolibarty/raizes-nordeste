import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source.js";
import { AppError } from "../errors/appError.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isLoggedInMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new AppError("É necessário estar autenticado para acessar esta rota.", 401);
  }

  const [scheme, token] = authorization.trim().split(/\s+/);

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    throw new AppError(
      "Token de autenticação inválido. Use o formato: Bearer <token>.",
      401,
    );
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("A variável de ambiente JWT_SECRET não foi configurada.");
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError("Token de autenticação inválido ou expirado.", 401);
  }

  const userId = typeof payload === "object" ? payload.sub ?? payload.id : null;

  if (typeof userId !== "string" || !UUID_PATTERN.test(userId)) {
    throw new AppError("O token não identifica um usuário válido.", 401);
  }

  const userRepository = AppDataSource.getRepository("User");
  const foundUser = await userRepository.findOneBy({ id: userId });

  if (!foundUser) {
    throw new AppError("O usuário autenticado não foi encontrado.", 401);
  }

  if (!foundUser.isActive) {
    throw new AppError("Este usuário está inativo e não pode acessar o sistema.", 403);
  }

  req.user = foundUser;
  return next();
};

export default isLoggedInMiddleware;
