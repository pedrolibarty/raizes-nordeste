import { AppDataSource } from "../../data-source.js";
import parsePaginationService from "../pagination/parsePagination.service.js";

const listClientsService = async (query = {}) => {
  const clientRepository = AppDataSource.getRepository("Client");
  const { page, limit, skip } = parsePaginationService(query);
  const [clients, total] = await clientRepository.findAndCount({
    select: { id: true, name: true, email: true, contact: true, city: true, state: true, createdAt: true, updatedAt: true },
    order: { name: "ASC" },
    skip,
    take: limit,
  });

  return { data: clients, page, limit, total, totalPages: Math.ceil(total / limit) };
};

export default listClientsService;
