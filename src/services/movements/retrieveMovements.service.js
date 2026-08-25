import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";
import { USER_ROLES } from "../../constants/user-roles.js";

const retrieveMovementsService = async (movementId, authenticatedUser) => {
  const movementRepository = AppDataSource.getRepository("Movement");
  const foundMovement = await movementRepository.findOne({
    where: { id: movementId },
    relations: {
      inventory: { product: { branch: true } },
      user: true,
    },
  });

  if (!foundMovement) {
    throw new AppError("Movimentação não encontrada.", 404);
  }
  if (
    authenticatedUser.role !== USER_ROLES.ADMIN &&
    authenticatedUser.branch.id !== foundMovement.inventory.product.branch.id
  ) {
    throw new AppError("Você não pode consultar movimentações de outra filial.", 403);
  }

  return foundMovement;
};

export default retrieveMovementsService;
