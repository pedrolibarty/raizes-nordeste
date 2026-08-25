import { AppDataSource } from "../../data-source.js";

export const assertTestDatabase = () => {
  const databaseName = process.env.DB_DATABASE_TEST;

  if (!databaseName?.endsWith("_test")) {
    throw new Error("Os testes só podem usar um banco cujo nome termine com _test.");
  }

  return databaseName;
};

export const initializeTestDatabase = async () => {
  const databaseName = assertTestDatabase();
  AppDataSource.setOptions({ database: databaseName });
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  return AppDataSource;
};

export const closeTestDatabase = async () => {
  if (AppDataSource.isInitialized) await AppDataSource.destroy();
};
