import { AppDataSource } from "../../data-source.js";

const listClientsService = async () => {
  const clientRepository = AppDataSource.getRepository("Client");
  const clients = await clientRepository.find({ order: { name: "ASC" } });

  return clients;
};

export default listClientsService;
