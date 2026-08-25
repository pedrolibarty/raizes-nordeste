import { AppDataSource } from "../../data-source.js";
import { In } from "typeorm";
import { AUTH_ACTOR_TYPES } from "../../constants/auth-actor-types.js";
import { USER_ROLES } from "../../constants/user-roles.js";
import parsePaginationService from "../pagination/parsePagination.service.js";

const listOrdersService = async (authentication, query = {}) => {
  const orderRepository = AppDataSource.getRepository("Order");
  const itemRepository = AppDataSource.getRepository("OrderItem");
  let where = {};

  if (authentication.actorType === AUTH_ACTOR_TYPES.CLIENT) {
    where = { client: { id: authentication.actorId } };
  } else if (authentication.actor.role !== USER_ROLES.ADMIN) {
    where = { branch: { id: authentication.actor.branch.id } };
  }

  const { page, limit, skip } = parsePaginationService(query);
  const [orders, total] = await orderRepository.findAndCount({
    where,
    relations: { branch: true, client: true, user: true },
    order: { createdAt: "DESC" },
    skip,
    take: limit,
  });
  const orderIds = orders.map((order) => order.id);
  const orderItems = orderIds.length
    ? await itemRepository.find({
        where: { order: { id: In(orderIds) } },
        relations: { order: true, product: true },
      })
    : [];
  const itemsByOrderId = orderItems.reduce((groupedItems, orderItem) => {
    const groupedOrderItems = groupedItems.get(orderItem.order.id) ?? [];
    groupedOrderItems.push(orderItem);
    groupedItems.set(orderItem.order.id, groupedOrderItems);
    return groupedItems;
  }, new Map());
  const data = orders.map((order) => ({
    ...order,
    items: itemsByOrderId.get(order.id) ?? [],
  }));
  return { data, page, limit, total, totalPages: Math.ceil(total / limit) };
};

export default listOrdersService;
