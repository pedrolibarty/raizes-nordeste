/**
 * @openapi
 * /audit-logs:
 *   get:
 *     tags: [Auditoria]
 *     summary: Lista registros de auditoria
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Auditorias encontradas, content: { application/json: { schema: { type: object, properties: { data: { type: array, items: { $ref: '#/components/schemas/AuditLog' } } } }, example: { data: [{ actorType: "USER", action: "CREATE", entity: "Order" }] } } } }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 * /audit-logs/{id}:
 *   get:
 *     tags: [Auditoria]
 *     summary: Consulta registro de auditoria
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ $ref: '#/components/parameters/Id' }]
 *     responses:
 *       200: { description: Auditoria encontrada, content: { application/json: { schema: { type: object, properties: { data: { $ref: '#/components/schemas/AuditLog' } } } } } }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
