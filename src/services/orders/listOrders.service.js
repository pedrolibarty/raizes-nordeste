import { AppDataSource } from "../../data-source.js";
import { AUTH_ACTOR_TYPES } from "../../constants/auth-actor-types.js";
import { USER_ROLES } from "../../constants/user-roles.js";

const listOrdersService = async (authentication) => {
  const orderRepository = AppDataSource.getRepository("Order");
  const itemRepository = AppDataSource.getRepository("OrderItem");
  let where = {};

  if (authentication.actorType === AUTH_ACTOR_TYPES.CLIENT) {
    where = { client: { id: authentication.actorId } };
  } else if (authentication.actor.role !== USER_ROLES.ADMIN) {
    where = { branch: { id: authentication.actor.branch.id } };
  }

  const orders = await orderRepository.find({
    where,
    relations: { branch: true, client: true, user: true },
    order: { createdAt: "DESC" },
  });

  return Promise.all(
    orders.map(async (order) => {
      const items = await itemRepository.find({
        where: { order: { id: order.id } },
        relations: { product: true },
      });
      return { ...order, items };
    }),
  );
};

export default listOrdersService;
