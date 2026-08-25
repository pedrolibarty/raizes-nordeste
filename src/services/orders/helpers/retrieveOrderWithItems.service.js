import { AppError } from "../../../errors/appError.js";

const retrieveOrderWithItemsService = async (repositoryManager, orderId) => {
  const orderRepository = repositoryManager.getRepository("Order");
  const itemRepository = repositoryManager.getRepository("OrderItem");
  const foundOrder = await orderRepository.findOne({
    where: { id: orderId },
    relations: { branch: true, client: true, user: true },
  });

  if (!foundOrder) {
    throw new AppError("Pedido não encontrado.", 404);
  }

  const orderItems = await itemRepository.find({
    where: { order: { id: orderId } },
    relations: { product: true },
    order: { createdAt: "ASC" },
  });

  return { foundOrder, orderItems };
};

export default retrieveOrderWithItemsService;
