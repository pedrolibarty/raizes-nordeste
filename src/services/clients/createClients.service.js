import bcrypt from "bcrypt";
import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const createClientsService = async (data) => {
  const clientRepository = AppDataSource.getRepository("Client");
  const clientWithSameCpf = await clientRepository.findOneBy({ cpf: data.cpf });

  if (clientWithSameCpf) {
    throw new AppError("Já existe um cliente cadastrado com este CPF.", 409);
  }

  const clientWithSameEmail = await clientRepository.findOneBy({
    email: data.email,
  });

  if (clientWithSameEmail) {
    throw new AppError("Já existe um cliente cadastrado com este e-mail.", 409);
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const createdClient = clientRepository.create({
    ...data,
    password: passwordHash,
  });
  const savedClient = await clientRepository.save(createdClient);

  delete savedClient.password;
  return savedClient;
};

export default createClientsService;
