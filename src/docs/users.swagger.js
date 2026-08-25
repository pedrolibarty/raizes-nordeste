/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Usuários]
 *     summary: Lista funcionários permitidos
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Funcionários encontrados, content: { application/json: { schema: { type: object, properties: { data: { type: array, items: { $ref: '#/components/schemas/User' } } } }, example: { data: [{ name: "Ana", role: "MANAGER", email: "ana@example.com", isActive: true }] } } } }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   post:
 *     tags: [Usuários]
 *     summary: Cria funcionário
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, required: [name, role, email, password, branchId], properties: { name: { type: string }, role: { type: string, enum: [ADMIN, MANAGER, ATTENDANT, KITCHEN] }, email: { type: string, format: email }, password: { type: string, format: password, writeOnly: true }, branchId: { type: string, format: uuid } } }, example: { name: "Ana", role: "ATTENDANT", email: "ana@example.com", password: "Senha@123", branchId: "123e4567-e89b-42d3-a456-426614174000" } } }
 *     responses:
 *       201: { description: Funcionário criado, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/User' } } } } } }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 * /users/{id}:
 *   parameters: [{ $ref: '#/components/parameters/Id' }]
 *   get:
 *     tags: [Usuários]
 *     summary: Consulta funcionário
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Funcionário encontrado, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/User' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Usuários]
 *     summary: Atualiza funcionário
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, properties: { name: { type: string }, role: { type: string }, email: { type: string, format: email }, password: { type: string, writeOnly: true }, branchId: { type: string, format: uuid }, isActive: { type: boolean } } }, example: { name: "Ana Souza", isActive: true } } }
 *     responses:
 *       200: { description: Funcionário atualizado, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/User' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 *   delete:
 *     tags: [Usuários]
 *     summary: Exclui funcionário
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Funcionário excluído }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
