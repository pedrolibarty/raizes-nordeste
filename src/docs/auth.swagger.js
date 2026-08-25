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
 *         content: { application/json: { schema: { $ref: '#/components/schemas/UserLoginResponse' }, example: { data: { token: "eyJhbGciOiJIUzI1NiJ9...", user: { name: "Administrador", role: "ADMIN", email: "admin@example.com", isActive: true } } } } }
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
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ClientLoginResponse' }, example: { data: { token: "eyJhbGciOiJIUzI1NiJ9...", client: { name: "Maria Silva", email: "cliente@example.com" } } } } }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 */
