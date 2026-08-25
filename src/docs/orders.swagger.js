/**
 * @openapi
 * /orders:
 *   get:
 *     tags: [Pedidos]
 *     summary: Lista pedidos visíveis ao usuário autenticado
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ $ref: '#/components/parameters/Page' }, { $ref: '#/components/parameters/Limit' }]
 *     responses:
 *       200: { description: Página de pedidos, content: { application/json: { example: { data: [{ status: "A", valAmount: 29.9, items: [] }], page: 1, limit: 20, total: 1, totalPages: 1 } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Pedidos]
 *     summary: Cria pedido com valores calculados pela API
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/OrderCreateRequest' }, example: { branchId: "123e4567-e89b-42d3-a456-426614174000", orderChannel: "APP", items: [{ productId: "123e4567-e89b-42d3-a456-426614174001", quantity: 2 }] } } }
 *     responses:
 *       201: { description: Pedido criado, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Order' } } } } } }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 * /orders/{id}:
 *   get:
 *     tags: [Pedidos]
 *     summary: Consulta pedido
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ $ref: '#/components/parameters/Id' }]
 *     responses:
 *       200: { description: Pedido encontrado, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Order' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 * /orders/{id}/status:
 *   patch:
 *     tags: [Pedidos]
 *     summary: Avança o status operacional do pedido
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ $ref: '#/components/parameters/Id' }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/OrderStatusRequest' }, example: { status: "C" } } }
 *     responses:
 *       200: { description: Status atualizado, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Order' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 * /orders/{id}/cancel:
 *   patch:
 *     tags: [Pedidos]
 *     summary: Cancela pedido
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ $ref: '#/components/parameters/Id' }]
 *     requestBody:
 *       required: false
 *       content: { application/json: { schema: { type: object }, example: {} } }
 *     responses:
 *       200: { description: Pedido cancelado, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Order' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 * /orders/{orderId}/items:
 *   post:
 *     tags: [Itens de pedidos]
 *     summary: Adiciona item ao pedido aguardando pagamento
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ $ref: '#/components/parameters/OrderId' }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/OrderItemRequest' }, example: { productId: "123e4567-e89b-42d3-a456-426614174001", quantity: 1 } } }
 *     responses:
 *       201: { description: Item adicionado, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/OrderItem' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 * /orders/{orderId}/items/{itemId}:
 *   parameters: [{ $ref: '#/components/parameters/OrderId' }, { $ref: '#/components/parameters/ItemId' }]
 *   patch:
 *     tags: [Itens de pedidos]
 *     summary: Atualiza item do pedido
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/OrderItemUpdateRequest' }, example: { quantity: 3 } } }
 *     responses:
 *       200: { description: Item atualizado, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/OrderItem' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       422: { $ref: '#/components/responses/UnprocessableEntity' }
 *   delete:
 *     tags: [Itens de pedidos]
 *     summary: Remove item do pedido
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Item removido, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/Order' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
