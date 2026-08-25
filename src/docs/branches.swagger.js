/**
 * @openapi
 * /branches:
 *   get:
 *     tags: [Filiais]
 *     summary: Lista filiais
 *     security: []
 *     responses:
 *       200: { description: Filiais encontradas, content: { application/json: { schema: { type: object, properties: { data: { type: array, items: { $ref: '#/components/schemas/Branch' } } } }, example: { data: [{ branchCode: 1, name: "Raízes - Centro", state: "PE" }] } } } }
 *   post:
 *     tags: [Filiais]
 *     summary: Cria uma filial
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object, required: [branchCode, name, openingRules, street, district, city, state, number], properties: { branchCode: { type: integer }, name: { type: string }, openingRules: { type: object }, street: { type: string }, district: { type: string }, city: { type: string }, state: { type: string }, number: { type: string } } }
 *           example: { branchCode: 2, name: "Raízes - Boa Viagem", openingRules: { weekdays: "08:00-22:00" }, street: "Av. Recife", district: "Boa Viagem", city: "Recife", state: "PE", number: "100" }
 *     responses:
 *       201: { description: Filial criada, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Branch' } } } } } }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 * /branches/{id}:
 *   parameters: [{ $ref: '#/components/parameters/Id' }]
 *   get:
 *     tags: [Filiais]
 *     summary: Consulta uma filial
 *     security: []
 *     responses:
 *       200: { description: Filial encontrada, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Branch' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Filiais]
 *     summary: Atualiza uma filial
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, properties: { name: { type: string }, openingRules: { type: object }, street: { type: string }, district: { type: string }, city: { type: string }, state: { type: string }, number: { type: string } } }, example: { name: "Raízes - Centro Atualizada" } } }
 *     responses:
 *       200: { description: Filial atualizada, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Branch' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 *   delete:
 *     tags: [Filiais]
 *     summary: Exclui uma filial
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Filial excluída }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
