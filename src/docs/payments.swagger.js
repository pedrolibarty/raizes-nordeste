/**
 * @openapi
 * /payments:
 *   get:
 *     tags: [Pagamentos]
 *     summary: Lista pagamentos visíveis ao usuário
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ $ref: '#/components/parameters/Page' }, { $ref: '#/components/parameters/Limit' }]
 *     responses:
 *       200: { description: Página de pagamentos, content: { application/json: { example: { data: [{ paymentMethod: "PIX", status: "A", valAmount: 59.8 }], page: 1, limit: 20, total: 1, totalPages: 1 } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 * /payments/{id}:
 *   get:
 *     tags: [Pagamentos]
 *     summary: Consulta pagamento
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ $ref: '#/components/parameters/Id' }]
 *     responses:
 *       200: { description: Pagamento encontrado, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Payment' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 * /payments/mock/{result}:
 *   post:
 *     tags: [Pagamentos]
 *     summary: Processa uma tentativa no provedor mock
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: result
 *         in: path
 *         required: true
 *         schema: { type: string, enum: [approved, declined, error] }
 *         example: approved
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, required: [orderId, paymentMethod], properties: { orderId: { type: string, format: uuid }, paymentMethod: { type: string } } }, example: { orderId: "123e4567-e89b-42d3-a456-426614174000", paymentMethod: "PIX" } } }
 *     responses:
 *       201: { description: Tentativa aprovada ou recusada registrada, content: { application/json: { example: { data: { payment: { status: "A", valAmount: 59.8 }, order: { status: "P" } } } } } }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 *       503: { description: Erro técnico simulado; a tentativa foi persistida, content: { application/json: { example: { message: "O serviço de pagamento apresentou um erro técnico. Tente novamente.", data: { payment: { status: "E", failureReason: "Erro técnico simulado pelo mock." }, order: { status: "A" } } } } } }
 */
