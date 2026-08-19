import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";

const createBranchesService = async (data) => {
  const branchRepository = AppDataSource.getRepository("Branch");
  const existingBranch = await branchRepository.findOneBy({
    branchCode: data.branchCode,
  });

  if (existingBranch) {
    throw new AppError(
      `Já existe uma filial cadastrada com o código ${data.branchCode}.`,
      409,
    );
  }

  const createdBranch = branchRepository.create(data);
  const savedBranch = await branchRepository.save(createdBranch);

  return savedBranch;
};

export default createBranchesService;
