import { AppError } from "../../../errors/appError.js";

const verifyOrderStockAvailabilityService = async (
  transactionManager,
  orderId,
) => {
  const itemRepository = transactionManager.getRepository("OrderItem");
  const inventoryRepository = transactionManager.getRepository("Inventory");
  const orderItems = await itemRepository.find({
    where: { order: { id: orderId } },
    relations: { product: true },
  });
  const quantitiesByProduct = new Map();

  for (const orderItem of orderItems) {
    const currentQuantity = quantitiesByProduct.get(orderItem.product.id) ?? 0;
    quantitiesByProduct.set(
      orderItem.product.id,
      currentQuantity + orderItem.quantity,
    );
  }

  for (const [productId, requestedQuantity] of quantitiesByProduct) {
    const foundInventory = await inventoryRepository.findOne({
      where: { product: { id: productId } },
      relations: { product: true },
    });

    if (!foundInventory) {
      throw new AppError("Estoque do produto não encontrado.", 404);
    }

    if (foundInventory.quantity < requestedQuantity) {
      throw new AppError(
        `Estoque insuficiente para ${foundInventory.product.name}. Disponível: ${foundInventory.quantity}; solicitado: ${requestedQuantity}.`,
        409,
      );
    }
  }
};

export default verifyOrderStockAvailabilityService;
