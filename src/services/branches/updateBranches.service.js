import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";
import { USER_ROLES } from "../../constants/user-roles.js";

const updateBranchesService = async (branchId, data, authenticatedUser) => {
  const branchRepository = AppDataSource.getRepository("Branch");
  const branch = await branchRepository.findOneBy({ id: branchId });

  if (!branch) {
    throw new AppError("Filial não encontrada.", 404);
  }
  if (
    authenticatedUser.role !== USER_ROLES.ADMIN &&
    authenticatedUser.branch.id !== branch.id
  ) {
    throw new AppError("Gerentes só podem atualizar a própria filial.", 403);
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
