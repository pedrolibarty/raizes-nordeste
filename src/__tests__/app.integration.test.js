import request from "supertest";
import { app } from "../app.js";

describe("Aplicação", () => {
  test("GET /health retorna o estado da API", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  test("GET /api-docs disponibiliza o Swagger", async () => {
    const response = await request(app).get("/api-docs/");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Swagger UI");
  });

  test("rota protegida rejeita requisição sem token", async () => {
    const response = await request(app).get("/orders");
    expect(response.status).toBe(401);
    expect(response.body.message).toBeDefined();
  });
});
