import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const retrieveBranchesService = async (branchId) => {
  const branchRepository = AppDataSource.getRepository("Branch");
  const branch = await branchRepository.findOneBy({ id: branchId });

  if (!branch) {
    throw new AppError("Filial não encontrada.", 404);
  }

  return branch;
};

export default retrieveBranchesService;
