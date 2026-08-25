import { AppDataSource } from "../../data-source.js";
import { AUTH_ACTOR_TYPES } from "../../constants/auth-actor-types.js";
import { USER_ROLES } from "../../constants/user-roles.js";

const listPaymentsService = async (authentication) => {
  const paymentRepository = AppDataSource.getRepository("Payment");
  let where = {};

  if (authentication.actorType === AUTH_ACTOR_TYPES.CLIENT) {
    where = { order: { client: { id: authentication.actorId } } };
  } else if (authentication.actor.role !== USER_ROLES.ADMIN) {
    where = { order: { branch: { id: authentication.actor.branch.id } } };
  }

  const payments = await paymentRepository.find({
    where,
    relations: {
      order: { branch: true, client: true, user: true },
    },
    order: { createdAt: "DESC" },
  });

  return payments;
};

export default listPaymentsService;
