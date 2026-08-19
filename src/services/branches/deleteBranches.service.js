import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const deleteBranchesService = async (branchId) => {
  const branchRepository = AppDataSource.getRepository("Branch");
  const branch = await branchRepository.findOneBy({ id: branchId });

  if (!branch) {
    throw new AppError("Filial não encontrada.", 404);
  }

  await branchRepository.remove(branch);
};

export default deleteBranchesService;
