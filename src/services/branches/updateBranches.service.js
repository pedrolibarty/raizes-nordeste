import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const updateBranchesService = async (branchId, data) => {
  const branchRepository = AppDataSource.getRepository("Branch");
  const branch = await branchRepository.findOneBy({ id: branchId });

  if (!branch) {
    throw new AppError("Filial não encontrada.", 404);
  }

  if (data.branchCode !== undefined) {
    const existingBranch = await branchRepository.findOneBy({
      branchCode: data.branchCode,
    });

    if (existingBranch && existingBranch.id !== branchId) {
      throw new AppError(
        `Já existe uma filial cadastrada com o código ${data.branchCode}.`,
        409,
      );
    }
  }

  branchRepository.merge(branch, data);
  const updatedBranch = await branchRepository.save(branch);

  return updatedBranch;
};

export default updateBranchesService;
