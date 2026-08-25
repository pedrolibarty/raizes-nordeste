/**
 * @openapi
 * /promotions:
 *   get:
 *     tags: [Promoções]
 *     summary: Lista promoções
 *     security: []
 *     responses:
 *       200: { description: Promoções encontradas, content: { application/json: { schema: { type: object, properties: { data: { type: array, items: { $ref: '#/components/schemas/Promotion' } } } }, example: { data: [{ description: "Oferta", valDiscount: 5, isActive: true }] } } } }
 *   post:
 *     tags: [Promoções]
 *     summary: Cria promoção
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, required: [productId, description], properties: { productId: { type: string, format: uuid }, description: { type: string }, valDiscount: { type: number }, extraPoints: { type: integer }, isActive: { type: boolean } } }, example: { productId: "123e4567-e89b-42d3-a456-426614174000", description: "Oferta", valDiscount: 5, extraPoints: 2 } } }
 *     responses:
 *       201: { description: Promoção criada, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Promotion' } } } } } }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 * /promotions/{id}:
 *   parameters: [{ $ref: '#/components/parameters/Id' }]
 *   get:
 *     tags: [Promoções]
 *     summary: Consulta promoção
 *     security: []
 *     responses:
 *       200: { description: Promoção encontrada, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Promotion' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Promoções]
 *     summary: Atualiza promoção
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, properties: { productId: { type: string, format: uuid }, description: { type: string }, valDiscount: { type: number }, extraPoints: { type: integer }, isActive: { type: boolean } } }, example: { valDiscount: 7 } } }
 *     responses:
 *       200: { description: Promoção atualizada, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Promotion' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 *   delete:
 *     tags: [Promoções]
 *     summary: Desativa promoção
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Promoção desativada }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
