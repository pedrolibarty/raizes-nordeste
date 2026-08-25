import { AppError } from "../../../errors/appError.js";
import { ORDER_ITEM_STATUSES } from "../../../constants/order-item-statuses.js";

const toCents = (value) => Math.round(Number(value) * 100);
const toMoney = (valueInCents) => (valueInCents / 100).toFixed(2);

const buildOrderItemValuesService = async (
  transactionManager,
  branchId,
  itemData,
) => {
  const productRepository = transactionManager.getRepository("Product");
  const promotionRepository = transactionManager.getRepository("Promotion");
  const inventoryRepository = transactionManager.getRepository("Inventory");
  const foundProduct = await productRepository.findOne({
    where: { id: itemData.productId },
    relations: { branch: true },
  });

  if (!foundProduct || foundProduct.branch.id !== branchId) {
    throw new AppError("Produto não encontrado nesta filial.", 404);
  }

  if (!foundProduct.isActive || !foundProduct.isAvailable) {
    throw new AppError(`O produto ${foundProduct.name} não está disponível.`, 409);
  }

  const foundInventory = await inventoryRepository.findOne({
    where: { product: { id: foundProduct.id } },
  });

  if (!foundInventory) {
    throw new AppError(`Estoque do produto ${foundProduct.name} não encontrado.`, 404);
  }

  if (foundInventory.quantity < itemData.quantity) {
    throw new AppError(
      `Estoque insuficiente para ${foundProduct.name}. Disponível: ${foundInventory.quantity}; solicitado: ${itemData.quantity}.`,
      409,
    );
  }

  const activePromotion = await promotionRepository.findOne({
    where: { product: { id: foundProduct.id }, isActive: true },
  });
  const unitAmountInCents = toCents(foundProduct.price);
  const originalAmountInCents = unitAmountInCents * itemData.quantity;
  const unitDiscountInCents = activePromotion
    ? Math.min(toCents(activePromotion.valDiscount), unitAmountInCents)
    : 0;
  const discountInCents = unitDiscountInCents * itemData.quantity;

  return {
    product: foundProduct,
    status: ORDER_ITEM_STATUSES.PENDING,
    quantity: itemData.quantity,
    notes: itemData.notes ?? null,
    valUniAmountOg: toMoney(unitAmountInCents),
    valAmountOg: toMoney(originalAmountInCents),
    valDiscount: toMoney(discountInCents),
    valAmount: toMoney(originalAmountInCents - discountInCents),
    points: (activePromotion?.extraPoints ?? 0) * itemData.quantity,
  };
};

export default buildOrderItemValuesService;
