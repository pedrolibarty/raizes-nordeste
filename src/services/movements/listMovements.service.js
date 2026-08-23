import { AppDataSource } from "../../data-source.js";

const listMovementsService = async () => {
  const movementRepository = AppDataSource.getRepository("Movement");
  const movements = await movementRepository.find({
    relations: {
      inventory: { product: { branch: true } },
      user: true,
    },
    order: { createdAt: "DESC" },
  });

  return movements;
};

export default listMovementsService;
