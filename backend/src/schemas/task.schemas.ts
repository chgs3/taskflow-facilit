import { TaskStatus } from '@prisma/client';
import { z } from 'zod';

const taskStatusSchema = z.nativeEnum(TaskStatus);

const optionalDateSchema = z
  .string()
  .datetime({ message: 'dueDate must be a valid ISO date.' })
  .optional()
  .nullable();

export const listTasksQuerySchema = z.object({
  status: taskStatusSchema.optional(),
  search: z
    .string()
    .trim()
    .max(100, 'Search must have at most 100 characters.')
    .optional()
});

export const createTaskSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required.'
    })
    .trim()
    .min(1, 'Title is required.')
    .max(120, 'Title must have at most 120 characters.'),
  description: z
    .string()
    .trim()
    .max(1000, 'Description must have at most 1000 characters.')
    .optional()
    .nullable(),
  status: taskStatusSchema.default(TaskStatus.A_FAZER),
  assignee: z
    .string()
    .trim()
    .max(120, 'Assignee must have at most 120 characters.')
    .optional()
    .nullable(),
  dueDate: optionalDateSchema
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty.')
    .max(120, 'Title must have at most 120 characters.')
    .optional(),
  description: z
    .string()
    .trim()
    .max(1000, 'Description must have at most 1000 characters.')
    .optional()
    .nullable(),
  status: taskStatusSchema.optional(),
  assignee: z
    .string()
    .trim()
    .max(120, 'Assignee must have at most 120 characters.')
    .optional()
    .nullable(),
  dueDate: optionalDateSchema
});

export const updateTaskStatusSchema = z.object({
  status: taskStatusSchema
});

export type ListTasksQueryInput = z.infer<typeof listTasksQuerySchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;