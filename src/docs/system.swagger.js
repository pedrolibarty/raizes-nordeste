/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Sistema]
 *     summary: Consulta a disponibilidade da API
 *     security: []
 *     responses:
 *       200:
 *         description: API disponível
 *         content:
 *           application/json:
 *             example: { status: "ok", message: "API is running." }
 * /api-docs.json:
 *   get:
 *     tags: [Sistema]
 *     summary: Retorna a especificação OpenAPI em JSON
 *     security: []
 *     responses:
 *       200:
 *         description: Especificação OpenAPI
 *         content:
 *           application/json:
 *             example: { openapi: "3.0.3" }
 */
