import { AppDataSource } from "../../data-source.js";
import { USER_ROLES } from "../../constants/user-roles.js";
import parsePaginationService from "../pagination/parsePagination.service.js";

const listMovementsService = async (authenticatedUser, query = {}) => {
  const movementRepository = AppDataSource.getRepository("Movement");
  const where = authenticatedUser.role === USER_ROLES.ADMIN
    ? {}
    : { inventory: { product: { branch: { id: authenticatedUser.branch.id } } } };
  const { page, limit, skip } = parsePaginationService(query);
  const [movements, total] = await movementRepository.findAndCount({
    where,
    relations: {
      inventory: { product: { branch: true } },
      user: true,
    },
    order: { createdAt: "DESC" },
    skip,
    take: limit,
  });

  return { data: movements, page, limit, total, totalPages: Math.ceil(total / limit) };
};

export default listMovementsService;
