import { Router } from 'express';

import { TaskController } from '../controllers/task.controller';
import { asyncHandler } from '../utils/asyncHandler';

export const taskRoutes = Router();

const taskController = new TaskController();

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     summary: Lista tarefas
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [A_FAZER, EM_PROGRESSO, ATRASADO, CONCLUIDO]
 *         required: false
 *         description: Filtra tarefas por status.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Busca tarefas por título ou descrição.
 *     responses:
 *       200:
 *         description: Lista de tarefas retornada com sucesso.
 */
taskRoutes.get('/tasks', asyncHandler(taskController.list));

/**
 * @openapi
 * /api/tasks/{id}:
 *   get:
 *     summary: Busca uma tarefa por ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tarefa encontrada.
 *       404:
 *         description: Tarefa não encontrada.
 */
taskRoutes.get('/tasks/:id', asyncHandler(taskController.findById));

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     summary: Cria uma nova tarefa
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Criar documentação da API
 *               description:
 *                 type: string
 *                 example: Documentar endpoints principais no Swagger.
 *               status:
 *                 type: string
 *                 enum: [A_FAZER, EM_PROGRESSO, ATRASADO, CONCLUIDO]
 *                 example: A_FAZER
 *               assignee:
 *                 type: string
 *                 example: Caique
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-10T23:59:59.000Z"
 *     responses:
 *       201:
 *         description: Tarefa criada.
 *       400:
 *         description: Erro de validação.
 */
taskRoutes.post('/tasks', asyncHandler(taskController.create));

/**
 * @openapi
 * /api/tasks/{id}:
 *   put:
 *     summary: Atualiza uma tarefa existente
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tarefa atualizada.
 *       404:
 *         description: Tarefa não encontrada.
 */
taskRoutes.put('/tasks/:id', asyncHandler(taskController.update));

/**
 * @openapi
 * /api/tasks/{id}/status:
 *   patch:
 *     summary: Atualiza somente o status de uma tarefa
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [A_FAZER, EM_PROGRESSO, ATRASADO, CONCLUIDO]
 *                 example: CONCLUIDO
 *     responses:
 *       200:
 *         description: Status atualizado.
 *       404:
 *         description: Tarefa não encontrada.
 */
taskRoutes.patch('/tasks/:id/status', asyncHandler(taskController.updateStatus));

/**
 * @openapi
 * /api/tasks/{id}:
 *   delete:
 *     summary: Remove uma tarefa
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Tarefa removida.
 *       404:
 *         description: Tarefa não encontrada.
 */
taskRoutes.delete('/tasks/:id', asyncHandler(taskController.delete));