const toCents = (value) => Math.round(Number(value) * 100);
const toMoney = (valueInCents) => (valueInCents / 100).toFixed(2);

const recalculateOrderTotalsService = async (transactionManager, order) => {
  const itemRepository = transactionManager.getRepository("OrderItem");
  const promotionRepository = transactionManager.getRepository("Promotion");
  const orderRepository = transactionManager.getRepository("Order");
  const orderItems = await itemRepository.find({
    where: { order: { id: order.id } },
    relations: { product: true },
  });
  const activeItems = orderItems.filter(
    (item) => item.status !== ORDER_ITEM_STATUSES.CANCELLED,
  );

  if (!activeItems.length) {
    throw new Error("O pedido deve possuir ao menos um item ativo.");
  }

  let originalAmountInCents = 0;
  let discountInCents = 0;
  let points = 0;

  for (const orderItem of activeItems) {
    originalAmountInCents += toCents(orderItem.valAmountOg);
    discountInCents += toCents(orderItem.valDiscount);
    const activePromotion = await promotionRepository.findOne({
      where: { product: { id: orderItem.product.id }, isActive: true },
    });
    points += (activePromotion?.extraPoints ?? 0) * orderItem.quantity;
  }

  order.valAmountOg = toMoney(originalAmountInCents);
  order.valDiscount = toMoney(discountInCents);
  order.valAmount = toMoney(originalAmountInCents - discountInCents);
  order.points = points;
  return orderRepository.save(order);
};

export default recalculateOrderTotalsService;
import { ORDER_ITEM_STATUSES } from "../../../constants/order-item-statuses.js";
