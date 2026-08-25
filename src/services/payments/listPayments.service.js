import { AppDataSource } from "../../data-source.js";
import { AUTH_ACTOR_TYPES } from "../../constants/auth-actor-types.js";
import { USER_ROLES } from "../../constants/user-roles.js";
import parsePaginationService from "../pagination/parsePagination.service.js";

const listPaymentsService = async (authentication, query = {}) => {
  const paymentRepository = AppDataSource.getRepository("Payment");
  let where = {};

  if (authentication.actorType === AUTH_ACTOR_TYPES.CLIENT) {
    where = { order: { client: { id: authentication.actorId } } };
  } else if (authentication.actor.role !== USER_ROLES.ADMIN) {
    where = { order: { branch: { id: authentication.actor.branch.id } } };
  }

  const { page, limit, skip } = parsePaginationService(query);
  const [payments, total] = await paymentRepository.findAndCount({
    where,
    relations: {
      order: { branch: true, client: true, user: true },
    },
    order: { createdAt: "DESC" },
    skip,
    take: limit,
  });

  return { data: payments, page, limit, total, totalPages: Math.ceil(total / limit) };
};

export default listPaymentsService;
