export type TaskStatus =
  | 'A_FAZER'
  | 'EM_PROGRESSO'
  | 'ATRASADO'
  | 'CONCLUIDO';

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  computedStatus: TaskStatus;
  statusLabel: string;
  assignee: string | null;
  createdAt: string;
  dueDate: string | null;
  updatedAt: string;
};

export type CreateTaskPayload = {
  title: string;
  description?: string | null;
  status: TaskStatus;
  assignee?: string | null;
  dueDate?: string | null;
};

export type UpdateTaskPayload = Partial<CreateTaskPayload>;

export type TaskFilters = {
  status?: TaskStatus | '';
  search?: string;
};