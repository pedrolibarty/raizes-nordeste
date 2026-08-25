import swaggerJsdoc from "swagger-jsdoc";

const identifier = { type: "string", format: "uuid", example: "123e4567-e89b-42d3-a456-426614174000" };
const timestamps = {
  createdAt: { type: "string", format: "date-time" },
  updatedAt: { type: "string", format: "date-time" },
};

export const swaggerSpecification = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "API Raízes do Nordeste",
      version: "1.0.0",
      description: "API de operação da rede Raízes do Nordeste.",
    },
    servers: [{ url: "http://localhost:3000", description: "Ambiente local" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      parameters: {
        Id: { name: "id", in: "path", required: true, schema: identifier },
        BranchId: { name: "branchId", in: "path", required: true, schema: identifier },
        ProductId: { name: "productId", in: "path", required: true, schema: identifier },
        OrderId: { name: "orderId", in: "path", required: true, schema: identifier },
        ItemId: { name: "itemId", in: "path", required: true, schema: identifier },
        Page: { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 }, example: 1 },
        Limit: { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 20 }, example: 20 },
      },
      responses: {
        BadRequest: { description: "Dados inválidos.", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" }, example: { message: "Os dados informados são inválidos." } } } },
        Unauthorized: { description: "Autenticação necessária ou inválida.", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" }, example: { message: "É necessário estar autenticado para acessar esta rota." } } } },
        Forbidden: { description: "Acesso não permitido.", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" }, example: { message: "Seu nível de acesso não permite esta operação." } } } },
        NotFound: { description: "Registro não encontrado.", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" }, example: { message: "Registro não encontrado." } } } },
        Conflict: { description: "Conflito com o estado atual do recurso.", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" }, example: { message: "A operação não pode ser concluída no estado atual." } } } },
        UnprocessableEntity: { description: "Falha de validação.", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" }, example: { message: "Os dados informados não atendem às regras de validação." } } } },
      },
      schemas: {
        Error: { type: "object", required: ["message"], properties: { message: { type: "string" } } },
        LoginRequest: { type: "object", required: ["email", "password"], properties: { email: { type: "string", format: "email", example: "usuario@example.com" }, password: { type: "string", format: "password", writeOnly: true, example: "Senha@123" } } },
        UserLoginResponse: { type: "object", properties: { data: { type: "object", properties: { token: { type: "string", example: "eyJhbGciOiJIUzI1NiJ9..." }, user: { $ref: "#/components/schemas/User" } } } } },
        ClientLoginResponse: { type: "object", properties: { data: { type: "object", properties: { token: { type: "string", example: "eyJhbGciOiJIUzI1NiJ9..." }, client: { $ref: "#/components/schemas/Client" } } } } },
        Branch: { type: "object", properties: { id: identifier, branchCode: { type: "integer", example: 1 }, name: { type: "string", example: "Raízes do Nordeste - Centro" }, openingRules: { type: "object", additionalProperties: true }, street: { type: "string" }, district: { type: "string" }, city: { type: "string" }, state: { type: "string", example: "PE" }, number: { type: "string" }, ...timestamps } },
        Client: { type: "object", properties: { id: identifier, name: { type: "string", example: "Maria Silva" }, cpf: { type: "string", example: "12345678901" }, contact: { type: "string" }, email: { type: "string", format: "email" }, street: { type: "string" }, district: { type: "string" }, city: { type: "string" }, state: { type: "string" }, number: { type: "string" }, ...timestamps } },
        User: { type: "object", properties: { id: identifier, name: { type: "string" }, role: { type: "string", enum: ["ADMIN", "MANAGER", "ATTENDANT", "KITCHEN"] }, email: { type: "string", format: "email" }, isActive: { type: "boolean" }, branch: { $ref: "#/components/schemas/Branch" }, ...timestamps } },
        Product: { type: "object", properties: { id: identifier, productCode: { type: "integer" }, name: { type: "string" }, category: { type: "string" }, isAvailable: { type: "boolean" }, isActive: { type: "boolean" }, price: { type: "number", format: "double" }, branch: { $ref: "#/components/schemas/Branch" }, stockQuantity: { type: "integer" }, ...timestamps } },
        Inventory: { type: "object", properties: { id: identifier, quantity: { type: "integer" }, product: { $ref: "#/components/schemas/Product" }, updatedAt: { type: "string", format: "date-time" } } },
        Movement: { type: "object", properties: { id: identifier, movementType: { type: "string", enum: ["E", "S"] }, quantity: { type: "integer" }, notes: { type: "string" }, inventory: { $ref: "#/components/schemas/Inventory" }, user: { $ref: "#/components/schemas/User" }, createdAt: { type: "string", format: "date-time" } } },
        Promotion: { type: "object", properties: { id: identifier, description: { type: "string" }, valDiscount: { type: "number" }, extraPoints: { type: "integer" }, isActive: { type: "boolean" }, product: { $ref: "#/components/schemas/Product" }, user: { $ref: "#/components/schemas/User" }, ...timestamps } },
        OrderItem: { type: "object", properties: { id: identifier, quantity: { type: "integer" }, status: { type: "string" }, valUniAmountOg: { type: "number" }, valAmountOg: { type: "number" }, valDiscount: { type: "number" }, valAmount: { type: "number" }, notes: { type: "string", nullable: true }, product: { $ref: "#/components/schemas/Product" }, ...timestamps } },
        Order: { type: "object", properties: { id: identifier, orderChannel: { type: "string", enum: ["APP", "TOTEM", "BALCAO", "PICKUP", "WEB"] }, status: { type: "string", enum: ["A", "P", "C", "R", "E", "X"] }, valAmountOg: { type: "number" }, valDiscount: { type: "number" }, valAmount: { type: "number" }, points: { type: "integer" }, branch: { $ref: "#/components/schemas/Branch" }, client: { $ref: "#/components/schemas/Client" }, user: { $ref: "#/components/schemas/User" }, items: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } }, ...timestamps } },
        Payment: { type: "object", properties: { id: identifier, paymentMethod: { type: "string", example: "PIX" }, status: { type: "string", enum: ["P", "A", "N", "E", "C", "R"] }, valAmount: { type: "number" }, externalTransactionId: { type: "string", nullable: true }, failureReason: { type: "string", nullable: true }, order: { $ref: "#/components/schemas/Order" }, createdAt: { type: "string", format: "date-time" }, paidAt: { type: "string", format: "date-time", nullable: true } } },
        LoyaltyAccount: { type: "object", properties: { id: identifier, hasConsent: { type: "boolean" }, consentedAt: { type: "string", format: "date-time", nullable: true }, pointsBalance: { type: "integer" }, client: { $ref: "#/components/schemas/Client" }, ...timestamps } },
        LoyaltyTransaction: { type: "object", properties: { id: identifier, transactionType: { type: "string", enum: ["E", "S"] }, points: { type: "integer" }, description: { type: "string" }, loyaltyAccount: { $ref: "#/components/schemas/LoyaltyAccount" }, order: { $ref: "#/components/schemas/Order" }, ...timestamps } },
        AuditLog: { type: "object", properties: { id: identifier, actorId: { ...identifier, nullable: true }, actorType: { type: "string", enum: ["USER", "CLIENT", "SYSTEM"] }, action: { type: "string" }, entity: { type: "string" }, entityId: identifier, oldData: { type: "object", nullable: true }, newData: { type: "object", nullable: true }, branch: { $ref: "#/components/schemas/Branch" }, createdAt: { type: "string", format: "date-time" } } },
        OrderItemRequest: { type: "object", required: ["productId", "quantity"], properties: { productId: identifier, quantity: { type: "integer", minimum: 1 }, notes: { type: "string", nullable: true } } },
        OrderItemUpdateRequest: { type: "object", properties: { productId: identifier, quantity: { type: "integer", minimum: 1 }, notes: { type: "string", nullable: true } } },
        OrderCreateRequest: { type: "object", required: ["branchId", "orderChannel", "items"], properties: { branchId: identifier, clientId: { ...identifier, nullable: true }, orderChannel: { type: "string", enum: ["APP", "TOTEM", "BALCAO", "PICKUP", "WEB"] }, items: { type: "array", minItems: 1, items: { $ref: "#/components/schemas/OrderItemRequest" } } } },
        OrderStatusRequest: { type: "object", required: ["status"], properties: { status: { type: "string", enum: ["C", "R", "E"] } } },
      },
    },
  },
  apis: ["./src/docs/*.swagger.js"],
});
