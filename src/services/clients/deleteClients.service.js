import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const deleteClientsService = async (clientId) => {
  const clientRepository = AppDataSource.getRepository("Client");
  const foundClient = await clientRepository.findOneBy({ id: clientId });

  if (!foundClient) {
    throw new AppError("Cliente não encontrado.", 404);
  }

  await clientRepository.remove(foundClient);
};

export default deleteClientsService;
