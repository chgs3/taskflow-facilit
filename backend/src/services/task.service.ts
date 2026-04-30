import { TaskStatus } from '@prisma/client';

import { TaskRepository } from '../repositories/task.repository';
import {
  CreateTaskInput,
  ListTasksQueryInput,
  UpdateTaskInput,
  UpdateTaskStatusInput
} from '../schemas/task.schemas';
import { AppError } from '../utils/AppError';
import {
  getComputedTaskStatus,
  serializeTask,
  TaskWithComputedStatus
} from '../utils/taskStatus';

export class TaskService {
  constructor(private readonly taskRepository = new TaskRepository()) {}

  async list(filters: ListTasksQueryInput): Promise<TaskWithComputedStatus[]> {
    const tasks = await this.taskRepository.findMany({
      status: filters.status,
      search: filters.search
    });

    const serializedTasks = tasks.map(serializeTask);

    if (filters.status === TaskStatus.ATRASADO) {
      return serializedTasks.filter(
        task => task.computedStatus === TaskStatus.ATRASADO
      );
    }

    return serializedTasks;
  }

  async findById(id: string): Promise<TaskWithComputedStatus> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new AppError('Tarefa não encontrada.', 404);
    }

    return serializeTask(task);
  }

  async create(data: CreateTaskInput): Promise<TaskWithComputedStatus> {
    const task = await this.taskRepository.create({
      title: data.title,
      description: data.description,
      status: data.status,
      assignee: data.assignee,
      dueDate: data.dueDate ? new Date(data.dueDate) : null
    });

    return serializeTask(task);
  }

  async update(
    id: string,
    data: UpdateTaskInput
  ): Promise<TaskWithComputedStatus> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new AppError('Tarefa não encontrada.', 404);
    }

    const updatedTask = await this.taskRepository.update(id, {
      title: data.title,
      description: data.description,
      status: data.status,
      assignee: data.assignee,
      dueDate:
        data.dueDate === undefined
          ? undefined
          : data.dueDate
            ? new Date(data.dueDate)
            : null
    });

    return serializeTask(updatedTask);
  }

  async updateStatus(
    id: string,
    data: UpdateTaskStatusInput
  ): Promise<TaskWithComputedStatus> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new AppError('Task not found.', 404);
    }

    const updatedTask = await this.taskRepository.update(id, {
      status: data.status
    });

    return serializeTask(updatedTask);
  }

  async delete(id: string): Promise<void> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new AppError('Task not found.', 404);
    }

    await this.taskRepository.delete(id);
  }

  getComputedStatusById = async (id: string) => {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new AppError('Task not found.', 404);
    }

    return getComputedTaskStatus(task);
  };
}