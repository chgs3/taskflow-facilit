import { TaskStatus } from '@prisma/client';

export const taskStatusLabels: Record<TaskStatus, string> = {
  A_FAZER: 'A Fazer',
  EM_PROGRESSO: 'Em Progresso',
  ATRASADO: 'Atrasado',
  CONCLUIDO: 'Concluído'
};

export const allowedTaskStatuses = [
  TaskStatus.A_FAZER,
  TaskStatus.EM_PROGRESSO,
  TaskStatus.ATRASADO,
  TaskStatus.CONCLUIDO
] as const;

export type TaskListFilters = {
  status?: TaskStatus;
  search?: string;
};