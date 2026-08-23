import { AppDataSource } from "../../data-source.js";
import {
  MOVEMENT_TYPES,
  MOVEMENT_TYPE_VALUES,
} from "../../constants/movement-types.js";
import { AppError } from "../../errors/appError.js";

const createMovementsService = async (data, authenticatedUser = null) => {
  if (!MOVEMENT_TYPE_VALUES.includes(data.movementType)) {
    throw new AppError("Tipo de movimentação inválido.", 422);
  }

  if (!Number.isInteger(data.quantity) || data.quantity <= 0) {
    throw new AppError("Quantidade deve ser um número inteiro maior que zero.", 422);
  }

  if (typeof data.notes !== "string" || !data.notes.trim()) {
    throw new AppError("Observação da movimentação é obrigatória.", 422);
  }

  return AppDataSource.transaction(async (transactionManager) => {
    const inventoryRepository = transactionManager.getRepository("Inventory");
    const movementRepository = transactionManager.getRepository("Movement");
    const foundInventory = await inventoryRepository.findOne({
      where: { id: data.inventoryId },
      lock: { mode: "pessimistic_write" },
    });

    if (!foundInventory) {
      throw new AppError("Estoque não encontrado.", 404);
    }

    const updatedQuantity =
      data.movementType === MOVEMENT_TYPES.ENTRY
        ? foundInventory.quantity + data.quantity
        : foundInventory.quantity - data.quantity;

    if (updatedQuantity < 0) {
      throw new AppError(
        `Estoque insuficiente. Quantidade disponível: ${foundInventory.quantity}.`,
        409,
      );
    }

    foundInventory.quantity = updatedQuantity;
    await inventoryRepository.save(foundInventory);

    const createdMovement = movementRepository.create({
      movementType: data.movementType,
      quantity: data.quantity,
      notes: data.notes.trim(),
      inventory: foundInventory,
      user: authenticatedUser,
    });
    const savedMovement = await movementRepository.save(createdMovement);

    return {
      ...savedMovement,
      stockQuantity: updatedQuantity,
    };
  });
};

export default createMovementsService;
