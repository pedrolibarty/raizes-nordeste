/**
 * @openapi
 * /products:
 *   get:
 *     tags: [Produtos]
 *     summary: Lista produtos e sua quantidade em estoque
 *     security: []
 *     responses:
 *       200: { description: Produtos encontrados, content: { application/json: { schema: { type: object, properties: { data: { type: array, items: { $ref: '#/components/schemas/Product' } } } }, example: { data: [{ productCode: 10, name: "Baião de dois", price: 29.9, stockQuantity: 15 }] } } } }
 *   post:
 *     tags: [Produtos]
 *     summary: Cria produto e estoque inicial zerado
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, required: [branchId, productCode, name, category, price], properties: { branchId: { type: string, format: uuid }, productCode: { type: integer }, name: { type: string }, category: { type: string }, price: { type: number }, isAvailable: { type: boolean }, isActive: { type: boolean } } }, example: { branchId: "123e4567-e89b-42d3-a456-426614174000", productCode: 10, name: "Baião de dois", category: "PRATO", price: 29.9 } } }
 *     responses:
 *       201: { description: Produto criado, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Product' } } } } } }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 * /products/branch/{branchId}:
 *   get:
 *     tags: [Produtos]
 *     summary: Lista produtos de uma filial
 *     security: []
 *     parameters: [{ $ref: '#/components/parameters/BranchId' }]
 *     responses:
 *       200: { description: Produtos encontrados, content: { application/json: { schema: { type: object, properties: { data: { type: array, items: { $ref: '#/components/schemas/Product' } } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 * /products/{id}:
 *   parameters: [{ $ref: '#/components/parameters/Id' }]
 *   get:
 *     tags: [Produtos]
 *     summary: Consulta produto
 *     security: []
 *     responses:
 *       200: { description: Produto encontrado, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Product' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Produtos]
 *     summary: Atualiza produto
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, properties: { branchId: { type: string, format: uuid }, productCode: { type: integer }, name: { type: string }, category: { type: string }, price: { type: number }, isAvailable: { type: boolean }, isActive: { type: boolean } } }, example: { price: 31.9, isAvailable: true } } }
 *     responses:
 *       200: { description: Produto atualizado, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Product' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 *   delete:
 *     tags: [Produtos]
 *     summary: Exclui produto
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Produto excluído }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
