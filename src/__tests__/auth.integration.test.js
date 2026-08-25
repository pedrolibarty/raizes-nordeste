import request from "supertest";
import { app } from "../app.js";
import {
  cleanTestDatabase,
  closeTestDatabase,
  initializeTestDatabase,
} from "./helpers/test-database.js";
import { createTestFixtures, TEST_PASSWORD } from "./helpers/test-fixtures.js";

describe("Autenticação", () => {
  let fixtures;

  beforeAll(async () => {
    process.env.JWT_SECRET ||= "segredo-exclusivo-dos-testes";
    await initializeTestDatabase();
  });

  beforeEach(async () => {
    await cleanTestDatabase();
    fixtures = await createTestFixtures();
  });

  afterAll(closeTestDatabase);

  test("login válido de funcionário retorna JWT", async () => {
    const response = await request(app).post("/users/login").send({
      email: fixtures.admin.email,
      password: TEST_PASSWORD,
    });
    expect(response.status).toBe(200);
    expect(response.body.data.token).toEqual(expect.any(String));
    expect(response.body.data.user).not.toHaveProperty("password");
  });

  test("login com senha inválida retorna 401", async () => {
    const response = await request(app).post("/users/login").send({
      email: fixtures.admin.email,
      password: "senha-incorreta",
    });
    expect(response.status).toBe(401);
  });

  test("cliente não acessa rota exclusiva de funcionário", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${fixtures.tokens.clientOne}`);
    expect(response.status).toBe(403);
  });
});
