import type { TaskStatus } from '../types/task';

export const taskStatusOptions: Array<{
  value: TaskStatus;
  label: string;
}> = [
  {
    value: 'A_FAZER',
    label: 'A Fazer'
  },
  {
    value: 'EM_PROGRESSO',
    label: 'Em Progresso'
  },
  {
    value: 'ATRASADO',
    label: 'Atrasado'
  },
  {
    value: 'CONCLUIDO',
    label: 'Concluído'
  }
];

export const editableTaskStatusOptions: Array<{
  value: Exclude<TaskStatus, 'ATRASADO'>;
  label: string;
}> = [
  {
    value: 'A_FAZER',
    label: 'A Fazer'
  },
  {
    value: 'EM_PROGRESSO',
    label: 'Em Progresso'
  },
  {
    value: 'CONCLUIDO',
    label: 'Concluído'
  }
];

export function getStatusClass(status: TaskStatus) {
  const classes: Record<TaskStatus, string> = {
    A_FAZER: 'status todo',
    EM_PROGRESSO: 'status progress',
    ATRASADO: 'status late',
    CONCLUIDO: 'status done'
  };

  return classes[status];
}