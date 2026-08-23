import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const retrieveMovementsService = async (movementId) => {
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

  return foundMovement;
};

export default retrieveMovementsService;
