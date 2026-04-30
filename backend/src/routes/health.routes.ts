import { Router } from 'express';

export const healthRoutes = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Verificando se a API tá online
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API funcionando corretamente
 */
healthRoutes.get('/health', (_request, response) => {
  return response.status(200).json({
    status: 'ok',
    service: 'taskflow-api',
    timestamp: new Date().toISOString()
  });
});