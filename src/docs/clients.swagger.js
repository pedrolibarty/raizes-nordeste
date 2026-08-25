/**
 * @openapi
 * /clients:
 *   get:
 *     tags: [Clientes]
 *     summary: Lista clientes sem CPF e endereço completo
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ $ref: '#/components/parameters/Page' }, { $ref: '#/components/parameters/Limit' }]
 *     responses:
 *       200: { description: Página de clientes, content: { application/json: { example: { data: [{ name: "Maria", email: "maria@example.com", city: "Recife", state: "PE" }], page: 1, limit: 20, total: 1, totalPages: 1 } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   post:
 *     tags: [Clientes]
 *     summary: Cadastra cliente
 *     security: []
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, required: [name, cpf, contact, email, password, street, district, city, state, number], properties: { name: { type: string }, cpf: { type: string }, contact: { type: string }, email: { type: string, format: email }, password: { type: string, writeOnly: true }, street: { type: string }, district: { type: string }, city: { type: string }, state: { type: string }, number: { type: string } } }, example: { name: "Maria", cpf: "12345678901", contact: "81999999999", email: "maria@example.com", password: "Senha@123", street: "Rua A", district: "Centro", city: "Recife", state: "PE", number: "10" } } }
 *     responses:
 *       201: { description: Cliente criado, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Client' } } } } } }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 * /clients/{id}:
 *   parameters: [{ $ref: '#/components/parameters/Id' }]
 *   get:
 *     tags: [Clientes]
 *     summary: Consulta cliente
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Cliente encontrado, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Client' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Clientes]
 *     summary: Atualiza cliente
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, properties: { name: { type: string }, contact: { type: string }, email: { type: string }, password: { type: string, writeOnly: true }, street: { type: string }, district: { type: string }, city: { type: string }, state: { type: string }, number: { type: string } } }, example: { contact: "81988888888" } } }
 *     responses:
 *       200: { description: Cliente atualizado, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Client' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 *   delete:
 *     tags: [Clientes]
 *     summary: Exclui cliente
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Cliente excluído }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
