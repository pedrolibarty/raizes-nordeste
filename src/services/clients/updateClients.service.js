import bcrypt from "bcrypt";
import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const updateClientsService = async (clientId, data) => {
  const clientRepository = AppDataSource.getRepository("Client");
  const foundClient = await clientRepository.findOneBy({ id: clientId });

  if (!foundClient) {
    throw new AppError("Cliente não encontrado.", 404);
  }

  if (data.cpf !== undefined && data.cpf !== foundClient.cpf) {
    const clientWithSameCpf = await clientRepository.findOneBy({ cpf: data.cpf });

    if (clientWithSameCpf) {
      throw new AppError("Já existe um cliente cadastrado com este CPF.", 409);
    }
  }

  if (data.email !== undefined && data.email !== foundClient.email) {
    const clientWithSameEmail = await clientRepository.findOneBy({
      email: data.email,
    });

    if (clientWithSameEmail) {
      throw new AppError("Já existe um cliente cadastrado com este e-mail.", 409);
    }
  }

  const updatedData = { ...data };

  if (updatedData.password !== undefined) {
    updatedData.password = await bcrypt.hash(updatedData.password, 10);
  }

  clientRepository.merge(foundClient, updatedData);
  const updatedClient = await clientRepository.save(foundClient);

  delete updatedClient.password;
  return updatedClient;
};

export default updateClientsService;
