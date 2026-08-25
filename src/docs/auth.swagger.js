/**
 * @openapi
 * /users/login:
 *   post:
 *     tags: [Autenticação]
 *     summary: Autentica um funcionário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LoginRequest' }
 *           example: { email: "admin@example.com", password: "Senha@123" }
 *     responses:
 *       200:
 *         description: Login realizado.
 *         content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/LoginResponse' } } }, example: { data: { token: "eyJhbGciOiJIUzI1NiJ9...", actorType: "USER" } } } }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 * /clients/login:
 *   post:
 *     tags: [Autenticação]
 *     summary: Autentica um cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LoginRequest' }
 *           example: { email: "cliente@example.com", password: "Senha@123" }
 *     responses:
 *       200:
 *         description: Login realizado.
 *         content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/LoginResponse' } } }, example: { data: { token: "eyJhbGciOiJIUzI1NiJ9...", actorType: "CLIENT" } } } }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 */
