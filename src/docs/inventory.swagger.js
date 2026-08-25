/**
 * @openapi
 * /inventory:
 *   get:
 *     tags: [Estoque]
 *     summary: Lista o estoque permitido ao funcionário
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Estoque encontrado, content: { application/json: { schema: { type: object, properties: { data: { type: array, items: { $ref: '#/components/schemas/Inventory' } } } }, example: { data: [{ quantity: 20 }] } } } }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 * /inventory/{id}:
 *   get:
 *     tags: [Estoque]
 *     summary: Consulta um registro de estoque
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ $ref: '#/components/parameters/Id' }]
 *     responses:
 *       200: { description: Estoque encontrado, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Inventory' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 * /inventory/product/{productId}:
 *   get:
 *     tags: [Estoque]
 *     summary: Consulta estoque por produto
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ $ref: '#/components/parameters/ProductId' }]
 *     responses:
 *       200: { description: Estoque encontrado, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Inventory' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 * /inventory/branch/{branchId}:
 *   get:
 *     tags: [Estoque]
 *     summary: Lista estoque por filial
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ $ref: '#/components/parameters/BranchId' }]
 *     responses:
 *       200: { description: Estoque encontrado, content: { application/json: { schema: { type: object, properties: { data: { type: array, items: { $ref: '#/components/schemas/Inventory' } } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
