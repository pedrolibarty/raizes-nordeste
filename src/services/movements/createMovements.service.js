import { AppDataSource } from "../../data-source.js";
import {
  MOVEMENT_TYPES,
  MOVEMENT_TYPE_VALUES,
} from "../../constants/movement-types.js";
import { USER_ROLES } from "../../constants/user-roles.js";
import { AppError } from "../../errors/appError.js";
import registerAuditLogsService from "../auditLogs/registerAuditLogs.service.js";

const createMovementsService = async (
  data,
  authenticatedUser = null,
  providedManager = null,
) => {
  if (!MOVEMENT_TYPE_VALUES.includes(data.movementType)) {
    throw new AppError("Tipo de movimentação inválido.", 422);
  }
  if (!Number.isInteger(data.quantity) || data.quantity <= 0) {
    throw new AppError("Quantidade deve ser um número inteiro maior que zero.", 422);
  }
  if (typeof data.notes !== "string" || !data.notes.trim()) {
    throw new AppError("Observação da movimentação é obrigatória.", 422);
  }

  const execute = async (transactionManager) => {
    const inventoryRepository = transactionManager.getRepository("Inventory");
    const movementRepository = transactionManager.getRepository("Movement");
    const lockedInventory = await inventoryRepository.findOne({
      where: { id: data.inventoryId },
      lock: { mode: "pessimistic_write" },
    });

    if (!lockedInventory) throw new AppError("Estoque não encontrado.", 404);

    const foundInventory = await inventoryRepository.findOne({
      where: { id: data.inventoryId },
      relations: { product: { branch: true } },
    });

    if (
      authenticatedUser &&
      authenticatedUser.role !== USER_ROLES.ADMIN &&
      authenticatedUser.branch.id !== foundInventory.product.branch.id
    ) {
      throw new AppError("Gerentes só podem movimentar o estoque da própria filial.", 403);
    }

    const updatedQuantity = data.movementType === MOVEMENT_TYPES.ENTRY
      ? lockedInventory.quantity + data.quantity
      : lockedInventory.quantity - data.quantity;

    if (updatedQuantity < 0) {
      throw new AppError(
        `Estoque insuficiente. Quantidade disponível: ${lockedInventory.quantity}.`,
        409,
      );
    }

    lockedInventory.quantity = updatedQuantity;
    await inventoryRepository.save(lockedInventory);
    const createdMovement = movementRepository.create({
      movementType: data.movementType,
      quantity: data.quantity,
      notes: data.notes.trim(),
      inventory: lockedInventory,
      user: authenticatedUser,
    });
    const savedMovement = await movementRepository.save(createdMovement);

    if (authenticatedUser) {
      await registerAuditLogsService(transactionManager, {
        authentication: {
          actorId: authenticatedUser.id,
          actorType: "USER",
          actor: authenticatedUser,
        },
        action: "CREATE_MANUAL",
        entity: "Movement",
        entityId: savedMovement.id,
        branchId: foundInventory.product.branch.id,
        newData: {
          movementType: savedMovement.movementType,
          quantity: savedMovement.quantity,
          inventoryId: foundInventory.id,
        },
      });
    }

    return { ...savedMovement, stockQuantity: updatedQuantity };
  };

  return providedManager
    ? execute(providedManager)
    : AppDataSource.transaction(execute);
};

export default createMovementsService;
