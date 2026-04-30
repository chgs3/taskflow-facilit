import { Task, TaskStatus } from '@prisma/client';

export type TaskWithComputedStatus = Task & {
  computedStatus: TaskStatus;
  statusLabel: string;
};

const taskStatusLabels: Record<TaskStatus, string> = {
  A_FAZER: 'A Fazer',
  EM_PROGRESSO: 'Em Progresso',
  ATRASADO: 'Atrasado',
  CONCLUIDO: 'Concluído'
};

export function getComputedTaskStatus(task: Task): TaskStatus {
  if (task.status === TaskStatus.CONCLUIDO) {
    return TaskStatus.CONCLUIDO;
  }

  if (!task.dueDate) {
    return task.status;
  }

  const now = new Date();

  if (task.dueDate < now) {
    return TaskStatus.ATRASADO;
  }

  return task.status;
}

export function serializeTask(task: Task): TaskWithComputedStatus {
  const computedStatus = getComputedTaskStatus(task);

  return {
    ...task,
    computedStatus,
    statusLabel: taskStatusLabels[computedStatus]
  };
}