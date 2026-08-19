import { AppDataSource } from "../../data-source.js";

const listBranchesService = async () => {
  const branchRepository = AppDataSource.getRepository("Branch");
  const branches = await branchRepository.find({
    order: { branchCode: "ASC" },
  });

  return branches;
};

export default listBranchesService;
