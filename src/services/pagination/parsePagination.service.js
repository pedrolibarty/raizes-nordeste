import { AppError } from "../../errors/appError.js";

const parsePaginationService = (query) => {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? 20 : Number(query.limit);

  if (!Number.isInteger(page) || page < 1) {
    throw new AppError("O parâmetro page deve ser um número inteiro maior que zero.", 400);
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new AppError("O parâmetro limit deve ser um número inteiro entre 1 e 100.", 400);
  }

  return { page, limit, skip: (page - 1) * limit };
};

export default parsePaginationService;
