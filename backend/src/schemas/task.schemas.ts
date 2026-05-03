import { TaskStatus } from '@prisma/client';
import { z } from 'zod';

const taskStatusSchema = z.nativeEnum(TaskStatus);

const editableTaskStatusSchema = z.enum([
  TaskStatus.A_FAZER,
  TaskStatus.EM_PROGRESSO,
  TaskStatus.CONCLUIDO
], {
  errorMap: () => ({
    message:
      'O status Atrasado é calculado automaticamente com base na data limite.'
  })
});

const optionalDateSchema = z
  .string()
  .datetime({ message: 'A data limite deve ser uma data ISO válida.' })
  .optional()
  .nullable();

export const listTasksQuerySchema = z.object({
  status: taskStatusSchema.optional(),
  search: z
    .string()
    .trim()
    .max(100, 'A busca deve ter no máximo 100 caracteres.')
    .optional()
});

export const createTaskSchema = z.object({
  title: z
    .string({
      required_error: 'O título é obrigatório.'
    })
    .trim()
    .min(1, 'O título é obrigatório.')
    .max(120, 'O título deve ter no máximo 120 caracteres.'),
  description: z
    .string()
    .trim()
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres.')
    .optional()
    .nullable(),
  status: editableTaskStatusSchema.default(TaskStatus.A_FAZER),
  assignee: z
    .string()
    .trim()
    .max(120, 'O responsável deve ter no máximo 120 caracteres.')
    .optional()
    .nullable(),
  dueDate: optionalDateSchema
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'O título não pode ficar vazio.')
    .max(120, 'O título deve ter no máximo 120 caracteres.')
    .optional(),
  description: z
    .string()
    .trim()
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres.')
    .optional()
    .nullable(),
  status: editableTaskStatusSchema.optional(),
  assignee: z
    .string()
    .trim()
    .max(120, 'O responsável deve ter no máximo 120 caracteres.')
    .optional()
    .nullable(),
  dueDate: optionalDateSchema
});

export const updateTaskStatusSchema = z.object({
  status: editableTaskStatusSchema
});

export type ListTasksQueryInput = z.infer<typeof listTasksQuerySchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;