import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source.js";
import { AUTH_ACTOR_TYPES } from "../constants/auth-actor-types.js";
import { AppError } from "../errors/appError.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isAuthenticatedMiddleware = async (req, res, next) => {
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

  const actorId = typeof payload === "object" ? payload.sub ?? payload.id : null;
  const actorType = typeof payload === "object" ? payload.actorType : null;

  if (typeof actorId !== "string" || !UUID_PATTERN.test(actorId)) {
    throw new AppError("O token não identifica uma conta válida.", 401);
  }

  if (actorType === AUTH_ACTOR_TYPES.CLIENT) {
    const clientRepository = AppDataSource.getRepository("Client");
    const foundClient = await clientRepository.findOneBy({ id: actorId });

    if (!foundClient) {
      throw new AppError("O cliente autenticado não foi encontrado.", 401);
    }

    req.client = foundClient;
    req.auth = {
      actorId,
      actorType: AUTH_ACTOR_TYPES.CLIENT,
      actor: foundClient,
    };

    return next();
  }

  if (actorType === AUTH_ACTOR_TYPES.USER || actorType === undefined) {
    const userRepository = AppDataSource.getRepository("User");
    const foundUser = await userRepository.findOneBy({ id: actorId });

    if (!foundUser) {
      throw new AppError("O usuário autenticado não foi encontrado.", 401);
    }

    if (!foundUser.isActive) {
      throw new AppError("Este usuário está inativo e não pode acessar o sistema.", 403);
    }

    req.user = foundUser;
    req.auth = {
      actorId,
      actorType: AUTH_ACTOR_TYPES.USER,
      actor: foundUser,
    };

    return next();
  }

  throw new AppError("O token possui um tipo de conta inválido.", 401);
};

export default isAuthenticatedMiddleware;
