import request from "supertest";
import { app } from "../app.js";

const documentedEndpoints = [
  "/users/login", "/clients/login", "/branches", "/products",
  "/inventory", "/movements", "/clients", "/users", "/orders",
  "/promotions", "/loyalty-accounts", "/loyalty-transactions",
  "/payments/mock/{result}", "/payments", "/audit-logs",
  "/health", "/api-docs.json",
];

describe("Swagger", () => {
  test("expõe contratos, parâmetros, corpos JSON e não expõe senha em entidades de resposta", async () => {
    const response = await request(app).get("/api-docs.json");
    const specification = response.body;
    expect(response.status).toBe(200);
    expect(specification.openapi).toBe("3.0.3");
    for (const endpoint of documentedEndpoints) {
      expect(Object.hasOwn(specification.paths, endpoint)).toBe(true);
    }
    for (const pathDefinition of Object.values(specification.paths)) {
      for (const method of ["post", "patch"]) {
        if (pathDefinition[method]) expect(pathDefinition[method]).toHaveProperty("requestBody");
      }
    }
    expect(specification.paths["/payments/mock/{result}"].post.parameters[0].name).toBe("result");
    expect(specification.paths["/products/branch/{branchId}"].get.parameters).toBeDefined();
    expect(specification.paths["/orders/{orderId}/items/{itemId}"].parameters).toHaveLength(2);
    for (const schemaName of ["User", "Client", "Order", "Payment"] ) {
      expect(specification.components.schemas[schemaName].properties).not.toHaveProperty("password");
    }
    const userLoginSchema = specification.components.schemas.UserLoginResponse;
    const clientLoginSchema = specification.components.schemas.ClientLoginResponse;
    expect(userLoginSchema.properties.data.properties.token).toBeDefined();
    expect(userLoginSchema.properties.data.properties.user.$ref).toBe("#/components/schemas/User");
    expect(userLoginSchema.properties.data.properties).not.toHaveProperty("actorType");
    expect(clientLoginSchema.properties.data.properties.token).toBeDefined();
    expect(clientLoginSchema.properties.data.properties.client.$ref).toBe("#/components/schemas/Client");
    expect(clientLoginSchema.properties.data.properties).not.toHaveProperty("actorType");
    expect(specification.paths["/users/login"].post.responses[200].content["application/json"].schema.$ref).toBe("#/components/schemas/UserLoginResponse");
    expect(specification.paths["/clients/login"].post.responses[200].content["application/json"].schema.$ref).toBe("#/components/schemas/ClientLoginResponse");
  });
});
