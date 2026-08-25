import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../data-source.js";
import { AUTH_ACTOR_TYPES } from "../../constants/auth-actor-types.js";
import { USER_ROLES } from "../../constants/user-roles.js";

export const TEST_PASSWORD = "Senha@123";

const createToken = (actorId, actorType, role) => jwt.sign(
  { actorType, ...(role ? { role } : {}) },
  process.env.JWT_SECRET,
  { subject: actorId, expiresIn: "1h" },
);

export const createTestFixtures = async () => {
  const branchRepository = AppDataSource.getRepository("Branch");
  const userRepository = AppDataSource.getRepository("User");
  const clientRepository = AppDataSource.getRepository("Client");
  const productRepository = AppDataSource.getRepository("Product");
  const inventoryRepository = AppDataSource.getRepository("Inventory");
  const promotionRepository = AppDataSource.getRepository("Promotion");
  const loyaltyAccountRepository = AppDataSource.getRepository("LoyaltyAccount");
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 4);

  const branchOne = await branchRepository.save(branchRepository.create({ branchCode: 101, name: "Filial Teste Um", openingRules: { weekdays: "08:00-22:00" }, street: "Rua Um", district: "Centro", city: "Recife", state: "PE", number: "1" }));
  const branchTwo = await branchRepository.save(branchRepository.create({ branchCode: 102, name: "Filial Teste Dois", openingRules: { weekdays: "08:00-22:00" }, street: "Rua Dois", district: "Centro", city: "Olinda", state: "PE", number: "2" }));

  const createUser = (name, email, role, branch) => userRepository.save(userRepository.create({ name, email, password: passwordHash, role, isActive: true, branch }));
  const admin = await createUser("Admin Teste", "admin@test.local", USER_ROLES.ADMIN, branchOne);
  const managerOne = await createUser("Gerente Um", "manager.one@test.local", USER_ROLES.MANAGER, branchOne);
  const managerTwo = await createUser("Gerente Dois", "manager.two@test.local", USER_ROLES.MANAGER, branchTwo);
  const attendantOne = await createUser("Atendente Um", "attendant.one@test.local", USER_ROLES.ATTENDANT, branchOne);
  const kitchenOne = await createUser("Cozinha Um", "kitchen.one@test.local", USER_ROLES.KITCHEN, branchOne);

  const createClient = (name, cpf, email) => clientRepository.save(clientRepository.create({ name, cpf, contact: "81999999999", email, password: passwordHash, street: "Rua Cliente", district: "Centro", city: "Recife", state: "PE", number: "10" }));
  const clientOne = await createClient("Cliente Um", "52998224725", "client.one@test.local");
  const clientTwo = await createClient("Cliente Dois", "16899535009", "client.two@test.local");

  const product = await productRepository.save(productRepository.create({ productCode: 201, name: "Baião Teste", category: "PRATO", price: "20.00", isAvailable: true, isActive: true, branch: branchOne }));
  const emptyProduct = await productRepository.save(productRepository.create({ productCode: 202, name: "Produto Sem Estoque", category: "PRATO", price: "15.00", isAvailable: true, isActive: true, branch: branchOne }));
  const otherBranchProduct = await productRepository.save(productRepository.create({ productCode: 203, name: "Produto Outra Filial", category: "PRATO", price: "12.00", isAvailable: true, isActive: true, branch: branchTwo }));
  const inventory = await inventoryRepository.save(inventoryRepository.create({ product, quantity: 20 }));
  await inventoryRepository.save(inventoryRepository.create({ product: emptyProduct, quantity: 0 }));
  await inventoryRepository.save(inventoryRepository.create({ product: otherBranchProduct, quantity: 20 }));
  await promotionRepository.save(promotionRepository.create({ description: "Pontos teste", valDiscount: "2.00", extraPoints: 10, isActive: true, product, user: admin }));
  const loyaltyAccount = await loyaltyAccountRepository.save(loyaltyAccountRepository.create({ client: clientOne, hasConsent: true, consentedAt: new Date(), pointsBalance: 0 }));

  const tokens = {
    admin: createToken(admin.id, AUTH_ACTOR_TYPES.USER, admin.role),
    managerOne: createToken(managerOne.id, AUTH_ACTOR_TYPES.USER, managerOne.role),
    managerTwo: createToken(managerTwo.id, AUTH_ACTOR_TYPES.USER, managerTwo.role),
    attendantOne: createToken(attendantOne.id, AUTH_ACTOR_TYPES.USER, attendantOne.role),
    kitchenOne: createToken(kitchenOne.id, AUTH_ACTOR_TYPES.USER, kitchenOne.role),
    clientOne: createToken(clientOne.id, AUTH_ACTOR_TYPES.CLIENT),
    clientTwo: createToken(clientTwo.id, AUTH_ACTOR_TYPES.CLIENT),
  };
  return { branchOne, branchTwo, admin, managerOne, managerTwo, attendantOne, kitchenOne, clientOne, clientTwo, product, emptyProduct, otherBranchProduct, inventory, loyaltyAccount, tokens };
};
