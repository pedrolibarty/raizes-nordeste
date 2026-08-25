/**
 * @openapi
 * /movements:
 *   get:
 *     tags: [Movimentações]
 *     summary: Lista movimentações permitidas
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ $ref: '#/components/parameters/Page' }, { $ref: '#/components/parameters/Limit' }]
 *     responses:
 *       200: { description: Página de movimentações, content: { application/json: { example: { data: [{ movementType: "E", quantity: 10, notes: "Compra" }], page: 1, limit: 20, total: 1, totalPages: 1 } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   post:
 *     tags: [Movimentações]
 *     summary: Registra movimentação manual
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, required: [inventoryId, movementType, quantity, notes], properties: { inventoryId: { type: string, format: uuid }, movementType: { type: string, enum: [E, S] }, quantity: { type: integer, minimum: 1 }, notes: { type: string } } }, example: { inventoryId: "123e4567-e89b-42d3-a456-426614174000", movementType: "E", quantity: 10, notes: "Compra semanal" } } }
 *     responses:
 *       201: { description: Movimentação criada, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Movement' } } } } } }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 * /movements/{id}:
 *   get:
 *     tags: [Movimentações]
 *     summary: Consulta movimentação
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ $ref: '#/components/parameters/Id' }]
 *     responses:
 *       200: { description: Movimentação encontrada, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Movement' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
