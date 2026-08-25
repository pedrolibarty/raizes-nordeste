/**
 * @openapi
 * /loyalty-accounts:
 *   get:
 *     tags: [Fidelidade]
 *     summary: Lista contas de fidelidade permitidas
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Contas encontradas, content: { application/json: { schema: { type: object, properties: { data: { type: array, items: { $ref: '#/components/schemas/LoyaltyAccount' } } } }, example: { data: [{ hasConsent: true, pointsBalance: 20 }] } } } }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   post:
 *     tags: [Fidelidade]
 *     summary: Cliente cria sua conta de fidelidade
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, required: [hasConsent], properties: { hasConsent: { type: boolean } } }, example: { hasConsent: true } } }
 *     responses:
 *       201: { description: Conta criada, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/LoyaltyAccount' } } } } } }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 * /loyalty-accounts/{id}:
 *   parameters: [{ $ref: '#/components/parameters/Id' }]
 *   get:
 *     tags: [Fidelidade]
 *     summary: Consulta conta de fidelidade
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Conta encontrada, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/LoyaltyAccount' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Fidelidade]
 *     summary: Atualiza consentimento da conta
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, properties: { hasConsent: { type: boolean } } }, example: { hasConsent: false } } }
 *     responses:
 *       200: { description: Conta atualizada, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/LoyaltyAccount' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 *   delete:
 *     tags: [Fidelidade]
 *     summary: Exclui conta de fidelidade
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Conta excluída }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 * /loyalty-transactions:
 *   get:
 *     tags: [Fidelidade]
 *     summary: Lista transações de fidelidade
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Transações encontradas, content: { application/json: { schema: { type: object, properties: { data: { type: array, items: { $ref: '#/components/schemas/LoyaltyTransaction' } } } }, example: { data: [{ transactionType: "S", points: 20, description: "Resgate" }] } } } }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   post:
 *     tags: [Fidelidade]
 *     summary: Registra saída de pontos pelo cliente
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, required: [loyaltyAccountId, transactionType, points], properties: { loyaltyAccountId: { type: string, format: uuid }, transactionType: { type: string, enum: [S] }, points: { type: integer, minimum: 1 }, description: { type: string } } }, example: { loyaltyAccountId: "123e4567-e89b-42d3-a456-426614174000", transactionType: "S", points: 20, description: "Resgate" } } }
 *     responses:
 *       201: { description: Transação criada, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/LoyaltyTransaction' } } } } } }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 * /loyalty-transactions/{id}:
 *   get:
 *     tags: [Fidelidade]
 *     summary: Consulta transação de fidelidade
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ $ref: '#/components/parameters/Id' }]
 *     responses:
 *       200: { description: Transação encontrada, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/LoyaltyTransaction' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
