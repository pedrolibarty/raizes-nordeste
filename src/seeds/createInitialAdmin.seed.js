import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source.js";
import { USER_ROLES } from "../constants/user-roles.js";

const requireEnvironmentValue = (name) => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`A variável de ambiente ${name} é obrigatória para executar o seed.`);
  }

  return value;
};

const createInitialAdminSeed = async () => {
  const adminName = requireEnvironmentValue("SEED_ADMIN_NAME");
  const adminEmail = requireEnvironmentValue("SEED_ADMIN_EMAIL").toLowerCase();
  const adminPassword = requireEnvironmentValue("SEED_ADMIN_PASSWORD");
  const branchName = requireEnvironmentValue("SEED_BRANCH_NAME");
  const branchCode = Number(requireEnvironmentValue("SEED_BRANCH_CODE"));

  if (!Number.isInteger(branchCode) || branchCode <= 0) {
    throw new Error("SEED_BRANCH_CODE deve ser um número inteiro positivo.");
  }

  await AppDataSource.initialize();

  try {
    await AppDataSource.transaction(async (transactionManager) => {
      const branchRepository = transactionManager.getRepository("Branch");
      const userRepository = transactionManager.getRepository("User");
      let branch = await branchRepository.findOneBy({ branchCode });

      if (!branch) {
        const createdBranch = branchRepository.create({
          branchCode,
          name: branchName,
          openingRules: {
            mondayToSaturday: "08:00-22:00",
            sunday: "10:00-20:00",
          },
          street: "Avenida Principal",
          district: "Centro",
          city: "Recife",
          state: "PE",
          number: "1",
        });
        branch = await branchRepository.save(createdBranch);
      }

      const existingAdmin = await userRepository.findOneBy({ email: adminEmail });

      if (!existingAdmin) {
        const passwordHash = await bcrypt.hash(adminPassword, 10);
        const createdAdmin = userRepository.create({
          name: adminName,
          email: adminEmail,
          password: passwordHash,
          role: USER_ROLES.ADMIN,
          isActive: true,
          branch,
        });
        await userRepository.save(createdAdmin);
      }
    });

    console.log("Seed do administrador inicial concluído.");
  } finally {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  }
};

createInitialAdminSeed().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
